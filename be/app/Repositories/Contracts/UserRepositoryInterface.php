<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

interface UserRepositoryInterface
{
    public function findByEmail(string $email): ?User;
    public function findByGoogleId(string $googleId): ?User;
    public function findById(int $id): ?User;
    public function create(array $data): User;
    public function update(User $user, array $data): User;
    public function paginate(array $filters, int $perPage = 15): LengthAwarePaginator;
}
