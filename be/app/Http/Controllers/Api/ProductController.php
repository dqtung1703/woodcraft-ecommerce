<?php

namespace App\Http\Controllers\Api;

use App\DTOs\Product\CreateProductDTO;
use App\DTOs\Product\ProductFilterDTO;
use App\DTOs\Product\UpdateProductDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\ProductDetailResource;
use App\Http\Resources\ProductResource;
use App\Http\Responses\ApiResponse;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class ProductController extends Controller
{
    public function __construct(private readonly ProductService $productService) {}

    public function index(Request $request): JsonResponse
    {
        $dto = ProductFilterDTO::fromRequest($request->all());
        $paginator = $this->productService->list($dto);

        return ApiResponse::success(
            ProductResource::collection($paginator->getCollection()),
            meta: [
                'pagination' => [
                    'total'        => $paginator->total(),
                    'per_page'     => $paginator->perPage(),
                    'current_page' => $paginator->currentPage(),
                    'last_page'    => $paginator->lastPage(),
                ],
            ]
        );
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $userId = $request->user('sanctum')?->id;
        $product = $this->productService->findOrFail($id, $userId);

        return ApiResponse::success(new ProductDetailResource($product));
    }

    public function related(int $id): JsonResponse
    {
        $products = $this->productService->getRelated($id);

        return ApiResponse::success(ProductResource::collection($products));
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        // $request->validated() không bao gồm files — phải merge thủ công
        $data = array_merge($request->validated(), [
            'images' => $request->file('images', []),
        ]);
        $dto = CreateProductDTO::fromRequest($data);
        $product = $this->productService->create($dto);

        return ApiResponse::created(new ProductDetailResource($product), 'Tạo sản phẩm thành công');
    }

    public function update(UpdateProductRequest $request, int $id): JsonResponse
    {
        // $request->validated() không bao gồm files — phải merge thủ công
        $data = array_merge($request->validated(), [
            'images'      => $request->file('images'),
            'keep_images' => $request->input('keep_images'),
        ]);
        $dto = UpdateProductDTO::fromRequest($data);
        $product = $this->productService->update($id, $dto);

        return ApiResponse::success(new ProductDetailResource($product), 'Cập nhật sản phẩm thành công');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->productService->delete($id);

        return ApiResponse::message('Đã xóa sản phẩm');
    }
}
