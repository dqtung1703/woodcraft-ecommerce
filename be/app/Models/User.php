<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password_hash',
        'role', 'phone', 'address',
    ];

    protected $hidden = [
        'password_hash',
    ];

    protected $casts = [
        'password_hash' => 'hashed',   // BCrypt tự động khi create/update
        'created_at'    => 'datetime',
        'updated_at'    => 'datetime',
    ];

    // Tự động thêm is_admin vào JSON response
    protected $appends = ['is_admin'];

    // ─── Auth override ─────────────────────────────────────────────────────

    /**
     * Override để Sanctum/Hash::check() dùng đúng column password_hash
     * thay vì column 'password' mặc định của Laravel
     */
    public function getAuthPassword(): string
    {
        return $this->password_hash;
    }

    // ─── Computed attributes ───────────────────────────────────────────────

    public function getIsAdminAttribute(): bool
    {
        return $this->role === 'admin';
    }

    // ─── Helper methods ────────────────────────────────────────────────────

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }

    // ─── Query Scopes ──────────────────────────────────────────────────────

    /**
     * Dùng trong DashboardService / UserRepository để lọc khách hàng
     */
    public function scopeCustomers($query)
    {
        return $query->where('role', 'customer');
    }

    public function scopeAdmins($query)
    {
        return $query->where('role', 'admin');
    }

    // ─── Relationships ─────────────────────────────────────────────────────

    public function cart(): HasOne
    {
        return $this->hasOne(Cart::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function voucherUsages(): HasMany
    {
        return $this->hasMany(VoucherUsage::class);
    }

    public function productViews(): HasMany
    {
        return $this->hasMany(ProductView::class);
    }
}
