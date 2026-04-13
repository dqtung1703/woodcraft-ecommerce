<?php

namespace App\Repositories\Contracts;

use App\Models\Order;
use Illuminate\Pagination\LengthAwarePaginator;

interface OrderRepositoryInterface
{
    public function findById(int $id, array $with = []): ?Order;
    public function findByIdAndUser(int $id, int $userId, array $with = []): ?Order;
    public function paginateByUser(int $userId, int $perPage = 10): LengthAwarePaginator;
    public function paginateAll(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function create(array $data): Order;
    public function updateStatus(Order $order, string $status): Order;
}
