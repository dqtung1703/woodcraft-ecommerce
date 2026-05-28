<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password_hash',
        'role',
        'phone',
        'address',
        'is_active',
        // Google OAuth fields
        'google_id',
        'avatar',
        'auth_provider',
        'google_linked_at',
        'email_verified_at',
    ];

    protected $hidden = [
        'password_hash',
        'remember_token',
    ];

    protected $casts = [
        // KHÔNG dùng 'hashed' cast cho password_hash vì sẽ bcrypt null thành chuỗi
        // Thay bằng mutator setPasswordHashAttribute() bên dưới
        'email_verified_at' => 'datetime',
        'google_linked_at'  => 'datetime',
        'is_active'         => 'boolean',
        'created_at'        => 'datetime',
        'updated_at'        => 'datetime',
    ];

    // Tự động thêm is_admin vào JSON response
    protected $appends = ['is_admin'];

    // ─── Auth override ─────────────────────────────────────────────────────

    /**
     * Override để Sanctum/Hash::check() dùng đúng column password_hash
     * thay vì column 'password' mặc định của Laravel.
     * Trả '' thay vì null để tránh lỗi khi tài khoản Google chưa có mật khẩu.
     */
    public function getAuthPassword(): string
    {
        return $this->password_hash ?? '';
    }

    // ─── Mutators ──────────────────────────────────────────────────────────

    /**
     * Mutator thủ công cho password_hash.
     * Chỉ hash khi value không null — tránh bcrypt(null) thành hash rỗng.
     * Dùng thay cho cast 'hashed' để hỗ trợ tài khoản Google không có mật khẩu.
     */
    public function setPasswordHashAttribute(?string $value): void
    {
        if ($value === null) {
            $this->attributes['password_hash'] = null;
        } elseif (Hash::needsRehash($value)) {
            // Plain text → hash
            $this->attributes['password_hash'] = Hash::make($value);
        } else {
            // Đã là bcrypt hash → giữ nguyên
            $this->attributes['password_hash'] = $value;
        }
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

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }
}
