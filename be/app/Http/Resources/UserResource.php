<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'name'             => $this->name,
            'email'            => $this->email,
            'phone'            => $this->phone,
            'address'          => $this->address,
            'role'             => $this->role,
            'is_admin'         => $this->is_admin ?? ($this->role === 'admin'),
            'is_active'        => (bool) ($this->is_active ?? true),
            // Google OAuth fields
            'avatar'           => $this->avatar,
            'auth_provider'    => $this->auth_provider ?? 'email',
            'google_linked_at' => $this->google_linked_at?->toIso8601String(),
            'created_at'       => $this->created_at?->toIso8601String(),
            'updated_at'       => $this->updated_at?->toIso8601String(),
        ];
    }
}
