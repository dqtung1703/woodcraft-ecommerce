<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class CustomerLockTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Setup dummy Google client ID for testing
        config(['services.google.client_id' => 'dummy_client_id']);
    }

    /**
     * 1. Đăng nhập bằng Email/Password của tài khoản bị khóa (với password đúng) trả về 403 ACCOUNT_LOCKED
     */
    public function test_login_fails_if_customer_is_locked_after_correct_password()
    {
        $user = User::factory()->create([
            'email' => 'locked@woodcraft.com',
            'password_hash' => 'password123',
            'role' => 'customer',
            'is_active' => false,
        ]);

        $response = $this->postJson('/api/v1/login', [
            'email' => 'locked@woodcraft.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(403)
                 ->assertJsonPath('success', false)
                 ->assertJsonPath('error_code', 'ACCOUNT_LOCKED');
    }

    /**
     * 2. Đăng nhập tài khoản bị khóa nhưng sai mật khẩu trả về 401 thông thường (tránh lộ thông tin)
     */
    public function test_login_fails_with_standard_unauthorized_if_locked_customer_provides_wrong_password()
    {
        $user = User::factory()->create([
            'email' => 'locked@woodcraft.com',
            'password_hash' => 'password123',
            'role' => 'customer',
            'is_active' => false,
        ]);

        $response = $this->postJson('/api/v1/login', [
            'email' => 'locked@woodcraft.com',
            'password' => 'wrongpassword',
        ]);

        // Trả về 401 chứ không phải 403
        $response->assertStatus(401)
                 ->assertJsonPath('error_code', 'INVALID_CREDENTIALS');
    }

    /**
     * 3. Đăng nhập Google với user bị khóa không được sinh token và không update link (trả về 403 ACCOUNT_LOCKED)
     */
    public function test_google_login_fails_for_existing_locked_user()
    {
        // Giả lập Http request đến API Google tokeninfo
        Http::fake([
            'oauth2.googleapis.com/tokeninfo*' => Http::response([
                'iss' => 'accounts.google.com',
                'aud' => 'dummy_client_id',
                'sub' => 'google-id-12345',
                'email' => 'locked_google@woodcraft.com',
                'email_verified' => 'true',
                'name' => 'Locked Google User',
            ], 200),
        ]);

        // Tạo sẵn user bị khóa và đã liên kết Google trước đó
        $user = User::factory()->create([
            'email' => 'locked_google@woodcraft.com',
            'google_id' => 'google-id-12345',
            'role' => 'customer',
            'is_active' => false,
        ]);

        $response = $this->postJson('/api/v1/auth/google', [
            'credential' => 'dummy-google-jwt-token',
        ]);

        $response->assertStatus(403)
                 ->assertJsonPath('error_code', 'ACCOUNT_LOCKED');
    }

    /**
     * 4. Tài khoản khách hàng bị khóa khi gọi API bằng token cũ phải bị từ chối và bị xóa token khỏi DB
     */
    public function test_active_middleware_blocks_requests_for_locked_customer_tokens()
    {
        $user = User::factory()->create([
            'email' => 'customer@woodcraft.com',
            'role' => 'customer',
            'is_active' => false,
        ]);

        // Tạo token đăng nhập
        $token = $user->createToken('test-token')->plainTextToken;

        // Request bằng token đó phải bị chặn 403
        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->getJson('/api/v1/profile');

        $response->assertStatus(403)
                 ->assertJsonPath('error_code', 'ACCOUNT_LOCKED');

        // Verify token đã bị xóa khỏi cơ sở dữ liệu
        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id,
        ]);
    }

    /**
     * 5. Admin toggle status thành công đối với role = customer, nhưng không thể tác động admin khác
     */
    public function test_admin_can_toggle_customer_status_only()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'is_active' => true,
        ]);

        $customer = User::factory()->create([
            'role' => 'customer',
            'is_active' => true,
        ]);

        $anotherAdmin = User::factory()->create([
            'role' => 'admin',
            'is_active' => true,
        ]);

        $adminToken = $admin->createToken('admin-token')->plainTextToken;

        // Admin toggle status customer thành công (chuyển thành false)
        $response = $this->withHeaders(['Authorization' => "Bearer $adminToken"])
                         ->putJson("/api/v1/admin/customers/{$customer->id}/toggle-status");

        $response->assertStatus(200)
                 ->assertJsonPath('data.is_active', false);

        $this->assertDatabaseHas('users', [
            'id' => $customer->id,
            'is_active' => false,
        ]);

        // Admin toggle status một admin khác sẽ trả về 404 vì query lọc theo User::customers()
        $response = $this->withHeaders(['Authorization' => "Bearer $adminToken"])
                         ->putJson("/api/v1/admin/customers/{$anotherAdmin->id}/toggle-status");

        $response->assertStatus(404);
    }

    /**
     * 6. Mở khóa tài khoản thì cho phép đăng nhập lại bình thường
     */
    public function test_unlock_allows_customer_to_login_again()
    {
        $user = User::factory()->create([
            'email' => 'toggle_login@woodcraft.com',
            'password_hash' => 'password123',
            'role' => 'customer',
            'is_active' => false,
        ]);

        // Đăng nhập thất bại khi bị khóa
        $response = $this->postJson('/api/v1/login', [
            'email' => 'toggle_login@woodcraft.com',
            'password' => 'password123',
        ]);
        $response->assertStatus(403);

        // Mở khóa
        $user->update(['is_active' => true]);

        // Đăng nhập thành công sau khi mở khóa
        $response = $this->postJson('/api/v1/login', [
            'email' => 'toggle_login@woodcraft.com',
            'password' => 'password123',
        ]);
        $response->assertStatus(200)
                 ->assertJsonStructure(['data' => ['user', 'token']]);
    }
}
