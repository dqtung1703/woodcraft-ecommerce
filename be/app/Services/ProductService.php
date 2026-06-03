<?php

namespace App\Services;

use App\DTOs\Product\CreateProductDTO;
use App\DTOs\Product\ProductFilterDTO;
use App\DTOs\Product\UpdateProductDTO;
use App\Exceptions\ProductException;
use App\Models\Product;
use App\Models\ProductView;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

final class ProductService
{
    public function __construct(
        private readonly ProductRepositoryInterface $productRepository
    ) {}

    public function list(ProductFilterDTO $dto): LengthAwarePaginator
    {
        return $this->productRepository->paginate($dto);
    }

    public function findOrFail(int $id, ?int $userId = null): Product
    {
        $product = $this->productRepository->findById(
            $id,
            ['category', 'images', 'discounts', 'reviews.user']
        );

        if (!$product) {
            throw ProductException::notFound($id);
        }

        try {
            $this->recordView($id, $userId, request());
        } catch (\Throwable $e) {
            Log::warning('Failed to record product view', ['product_id' => $id, 'error' => $e->getMessage()]);
        }

        return $product;
    }

    private function recordView(int $productId, ?int $userId, $request): void
    {
        $ipHash = hash('xxh3', $request->ip() ?? 'unknown');
        
        if ($userId) {
            ProductView::upsert(
                [
                    'user_id'    => $userId,
                    'ip_hash'    => null,
                    'product_id' => $productId,
                    'viewed_at'  => now(),
                ],
                uniqueBy: ['user_id', 'product_id'],
                update:   ['viewed_at']
            );
        } else {
            ProductView::upsert(
                [
                    'user_id'    => null,
                    'ip_hash'    => $ipHash,
                    'product_id' => $productId,
                    'viewed_at'  => now(),
                ],
                uniqueBy: ['ip_hash', 'product_id'],
                update:   ['viewed_at']
            );
        }
    }

    public function create(CreateProductDTO $dto): Product
    {
        return DB::transaction(function () use ($dto) {
            $product = $this->productRepository->create([
                'name'           => $dto->name,
                'original_price' => $dto->originalPrice,
                'cost_price'     => $dto->costPrice,
                'price'          => $dto->price,
                'stock'          => $dto->stock,
                'category_id'    => $dto->categoryId,
                'description'    => $dto->description,
                'material'       => $dto->material,
            ]);

            if (!empty($dto->imageFiles)) {
                $urls = $this->storeImages($dto->imageFiles);
                $this->productRepository->syncImages($product, $urls);
            }

            return $product->load(['category', 'images', 'discounts']);
        });
    }

    public function update(int $id, UpdateProductDTO $dto): Product
    {
        return DB::transaction(function () use ($id, $dto) {
            // Eager load images để có thể so sánh URL cũ khi replace
            $product = $this->productRepository->findByIdOrFail($id, ['images']);

            // Cập nhật các field text
            $dataToUpdate = [];
            if ($dto->name          !== null) $dataToUpdate['name']           = $dto->name;
            if ($dto->originalPrice !== null) $dataToUpdate['original_price'] = $dto->originalPrice;
            if ($dto->costPrice     !== null) $dataToUpdate['cost_price']     = $dto->costPrice;
            if ($dto->price         !== null) $dataToUpdate['price']          = $dto->price;
            if ($dto->stock         !== null) $dataToUpdate['stock']          = $dto->stock;
            if ($dto->categoryId    !== null) $dataToUpdate['category_id']    = $dto->categoryId;
            if ($dto->description   !== null) $dataToUpdate['description']    = $dto->description;
            if ($dto->material      !== null) $dataToUpdate['material']       = $dto->material;

            if (!empty($dataToUpdate)) {
                $this->productRepository->update($product, $dataToUpdate);
            }

            // Xử lý ảnh: CHỈ khi replace_images=true
            // → không gửi replace_images = giữ nguyên ảnh cũ (safe default)
            if ($dto->replaceImages) {
                $keepUrls = $dto->keepImages ?? [];
                $newUrls  = !empty($dto->imageFiles) ? $this->storeImages($dto->imageFiles) : [];

                // Xóa file cũ không còn trong keep list
                $oldUrls = $product->images->pluck('image_url')->toArray();
                foreach ($oldUrls as $oldUrl) {
                    if (!in_array($oldUrl, $keepUrls)) {
                        $this->deleteImageFile($oldUrl);
                    }
                }

                // Sync: giữ cũ + thêm mới
                $this->productRepository->syncImages($product, array_merge($keepUrls, $newUrls));
            }

            return $product->load(['category', 'images', 'discounts']);
        });
    }

    public function delete(int $id): void
    {
        $product = $this->productRepository->findByIdOrFail($id);
        $this->productRepository->delete($product);
    }

    public function getRelated(int $id): Collection
    {
        $product = $this->productRepository->findById($id);

        if (!$product) {
            throw ProductException::notFound($id);
        }

        return $this->productRepository->getRelated($product);
    }

    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Store danh sách file và trả về mảng absolute URL.
     * Dùng asset() để URL luôn dựa trên APP_URL trong .env,
     * tránh URL tương đối /storage/... không hoạt động với FE khác port.
     *
     * @param  UploadedFile[]  $files
     * @return string[]
     */
    private function storeImages(array $files): array
    {
        return array_map(function (UploadedFile $file) {
            $path = $file->store('products', 'public');
            // asset(Storage::url($path)) → https://APP_URL/storage/products/xxx.jpg
            return asset(Storage::url($path));
        }, $files);
    }

    /**
     * Xóa file ảnh local. Có guard: chỉ xóa nếu URL thuộc /storage/...
     * Tránh cố xóa ảnh từ Cloudinary, S3, hay URL seed từ nguồn ngoài.
     */
    private function deleteImageFile(string $url): void
    {
        $path = parse_url($url, PHP_URL_PATH);

        // Guard: chỉ xóa file local (có path bắt đầu bằng /storage/)
        if (!$path || !str_starts_with($path, '/storage/')) {
            return;
        }

        // /storage/products/xxx.jpg → products/xxx.jpg
        $relativePath = str_replace('/storage/', '', $path);
        Storage::disk('public')->delete($relativePath);
    }
}
