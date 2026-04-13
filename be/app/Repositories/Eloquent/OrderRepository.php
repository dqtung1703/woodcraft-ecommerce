<?php

namespace App\Repositories\Eloquent;

use App\Models\Order;
use App\Repositories\Contracts\OrderRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class OrderRepository implements OrderRepositoryInterface
{
    public function __construct(private readonly Order $model) {}

    public function findById(int $id, array $with = []): ?Order
    {
        return $this->model->with($with)->find($id);
    }

    public function findByIdAndUser(int $id, int $userId, array $with = []): ?Order
    {
        return $this->model->with($with)->where('user_id', $userId)->find($id);
    }

    public function paginateByUser(int $userId, int $perPage = 10): LengthAwarePaginator
    {
        return $this->model
            ->with(['items.product.images', 'payment'])
            ->where('user_id', $userId)
            ->latest()
            ->paginate($perPage);
    }

    public function paginateAll(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->with(['user', 'items', 'payment'])->latest();

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->whereHas('user', fn($q) => $q
                ->where('name', 'like', "%$search%")
                ->orWhere('email', 'like', "%$search%")
            );
        }

        if (!empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        return $query->paginate($perPage);
    }

    public function create(array $data): Order
    {
        return $this->model->create($data);
    }

    public function updateStatus(Order $order, string $status): Order
    {
        $order->update(['status' => $status]);
        return $order->fresh();
    }
}
