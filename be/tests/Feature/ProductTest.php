<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_anyone_can_get_product_list()
    {
        $response = $this->getJson('/api/v1/products');

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonStructure(['data', 'meta' => ['pagination']]);
    }

    public function test_admin_can_create_product()
    {
        $admin = User::factory()->create(['role' => 'admin', 'password_hash' => 'pwd']);
        $token = $admin->createToken('test-token')->plainTextToken;
        $category = Category::create(['name' => 'Bàn ghế', 'description' => 'Bàn ghế gỗ']);

        $payload = [
            'name' => 'Bàn làm việc gỗ Sồi',
            'description' => 'Bàn xịn',
            'original_price' => 2000000,
            'price' => 1500000,
            'stock' => 10,
            'category_id' => $category->id,
            'material' => 'Gỗ Sồi'
        ];

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->postJson('/api/v1/admin/products', $payload);

        $response->assertStatus(201)
                 ->assertJsonPath('success', true)
                 ->assertJsonPath('data.name', 'Bàn làm việc gỗ Sồi');
                 
        $this->assertDatabaseHas('products', ['name' => 'Bàn làm việc gỗ Sồi']);
    }

    public function test_create_product_validation_errors()
    {
        $admin = User::factory()->create(['role' => 'admin', 'password_hash' => 'pwd']);
        $token = $admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->postJson('/api/v1/admin/products', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name', 'original_price', 'price']);
    }

    public function test_normal_user_cannot_create_product()
    {
        $user = User::factory()->create(['role' => 'customer', 'password_hash' => 'pwd']);
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->postJson('/api/v1/admin/products', [
                             'name' => 'Test'
                         ]);

        // Route group prefix 'admin' + middleware 'admin' returns 403
        $response->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_create_product()
    {
        $response = $this->postJson('/api/v1/admin/products', [
            'name' => 'Test'
        ]);

        $response->assertStatus(401);
    }
}
