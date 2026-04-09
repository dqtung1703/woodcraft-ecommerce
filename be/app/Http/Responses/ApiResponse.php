<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Centralized API response wrapper.
 * Mọi response trong hệ thống đều đi qua đây — không được trả response trực tiếp từ Controller.
 */
final class ApiResponse
{
    /**
     * 200 — Thành công, có data
     */
    public static function success(
        mixed  $data = null,
        string $message = 'Success',
        int    $statusCode = 200,
        array  $meta = []
    ): JsonResponse {
        $payload = [
            'success' => true,
            'message' => $message,
            'data'    => self::resolveData($data),
        ];

        if ($data instanceof LengthAwarePaginator) {
            $payload['meta'] = array_merge($meta, self::paginationMeta($data));
        } elseif (!empty($meta)) {
            $payload['meta'] = $meta;
        }

        return response()->json($payload, $statusCode);
    }

    /**
     * 201 — Tạo mới thành công
     */
    public static function created(mixed $data = null, string $message = 'Created successfully'): JsonResponse
    {
        return self::success($data, $message, 201);
    }

    /**
     * 200 — Không có data (delete, logout...)
     */
    public static function message(string $message, int $statusCode = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
        ], $statusCode);
    }

    /**
     * 4xx / 5xx — Lỗi
     */
    public static function error(
        string $message,
        int    $statusCode = 400,
        mixed  $errors = null,
        ?string $errorCode = null
    ): JsonResponse {
        $payload = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors !== null) {
            $payload['errors'] = $errors;
        }

        if ($errorCode !== null) {
            $payload['error_code'] = $errorCode;
        }

        return response()->json($payload, $statusCode);
    }

    /**
     * 422 — Validation failed
     */
    public static function validationError(array $errors, string $message = 'Validation failed'): JsonResponse
    {
        return self::error($message, 422, $errors, 'VALIDATION_ERROR');
    }

    /**
     * 401 — Unauthenticated
     */
    public static function unauthorized(string $message = 'Unauthenticated'): JsonResponse
    {
        return self::error($message, 401, errorCode: 'UNAUTHENTICATED');
    }

    /**
     * 403 — Forbidden
     */
    public static function forbidden(string $message = 'Forbidden'): JsonResponse
    {
        return self::error($message, 403, errorCode: 'FORBIDDEN');
    }

    /**
     * 404 — Not found
     */
    public static function notFound(string $message = 'Resource not found'): JsonResponse
    {
        return self::error($message, 404, errorCode: 'NOT_FOUND');
    }

    /**
     * 429 — Too many requests
     */
    public static function tooManyRequests(string $message = 'Too many requests'): JsonResponse
    {
        return self::error($message, 429, errorCode: 'TOO_MANY_REQUESTS');
    }

    /**
     * 500 — Server error
     */
    public static function serverError(string $message = 'Internal server error'): JsonResponse
    {
        return self::error($message, 500, errorCode: 'SERVER_ERROR');
    }

    // ─────────────────────────────────────────────────────────────────────────

    private static function resolveData(mixed $data): mixed
    {
        if ($data instanceof JsonResource || $data instanceof ResourceCollection) {
            return $data->resolve();
        }

        if ($data instanceof LengthAwarePaginator) {
            return $data->items();
        }

        return $data;
    }

    private static function paginationMeta(LengthAwarePaginator $paginator): array
    {
        return [
            'pagination' => [
                'total'        => $paginator->total(),
                'per_page'     => $paginator->perPage(),
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
                'from'         => $paginator->firstItem(),
                'to'           => $paginator->lastItem(),
                'has_more'     => $paginator->hasMorePages(),
            ],
        ];
    }
}
