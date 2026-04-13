<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class UserRepository implements UserRepositoryInterface
{
    public function __construct(private readonly User $model) {}

    public function findByEmail(string $email): ?User
    {
        return $this->model->where('email', $email)->first();
    }

    public function findById(int $id): ?User
    {
        return $this->model->find($id);
    }

    public function create(array $data): User
    {
        return $this->model->create($data);
    }

    public function update(User $user, array $data): User
    {
        $user->fill($data)->save();
        return $user->fresh();
    }

    public function paginate(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model
            ->where('role', 'customer')
            ->withCount('orders')
            ->withSum('orders', 'final_price')  // Tổng chi tiêu — dùng trong Dashboard
            ->latest();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(fn($q) => $q
                ->where('name', 'like', "%$search%")
                ->orWhere('email', 'like', "%$search%")
            );
        }

        return $query->paginate($perPage);
    }
}
