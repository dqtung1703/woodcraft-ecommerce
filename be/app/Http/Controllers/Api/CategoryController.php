<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

final class CategoryController extends Controller
{
    // GET /api/v1/categories  (public)
    public function index(): JsonResponse
    {
        $categories = Category::withCount('products')
            ->orderBy('name')
            ->get()
            ->map(fn($c) => [
                'id'             => $c->id,
                'name'           => $c->name,
                'description'    => $c->description,
                'products_count' => $c->products_count,
            ]);

        return ApiResponse::success($categories);
    }

    // GET /api/v1/categories/{id}  (public)
    public function show(int $id): JsonResponse
    {
        $category = Category::withCount('products')->findOrFail($id);

        return ApiResponse::success([
            'id'             => $category->id,
            'name'           => $category->name,
            'description'    => $category->description,
            'products_count' => $category->products_count,
        ]);
    }

    // POST /api/v1/admin/categories  (admin)
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:255', Rule::unique('categories', 'name')],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        $category = Category::create($validated);

        return ApiResponse::created([
            'id'          => $category->id,
            'name'        => $category->name,
            'description' => $category->description,
        ], 'Tạo danh mục thành công.');
    }

    // PUT /api/v1/admin/categories/{id}  (admin)
    public function update(Request $request, int $id): JsonResponse
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => [
                'sometimes', 'string', 'max:255',
                Rule::unique('categories', 'name')->ignore($id),
            ],
            'description' => ['sometimes', 'nullable', 'string', 'max:1000'],
        ]);

        $category->update($validated);

        return ApiResponse::success([
            'id'          => $category->id,
            'name'        => $category->name,
            'description' => $category->description,
        ], 'Cập nhật danh mục thành công.');
    }

    // DELETE /api/v1/admin/categories/{id}  (admin)
    public function destroy(int $id): JsonResponse
    {
        $category = Category::withCount('products')->findOrFail($id);

        if ($category->products_count > 0) {
            return ApiResponse::error(
                "Không thể xóa danh mục đang có {$category->products_count} sản phẩm.",
                422,
                null,
                'CATEGORY_HAS_PRODUCTS'
            );
        }

        $category->delete();

        return ApiResponse::message('Xóa danh mục thành công.');
    }
}
