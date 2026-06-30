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

    public function test_admin_can_create_product_with_discount()
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
            'material' => 'Gỗ Sồi',
            'discount_type' => 'fixed',
            'discount_value' => 200000,
            'discount_start_date' => now()->subDay()->format('Y-m-d H:i:s'),
            'discount_end_date' => now()->addWeek()->format('Y-m-d H:i:s'),
        ];

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->postJson('/api/v1/admin/products', $payload);

        $response->assertStatus(201)
                 ->assertJsonPath('success', true)
                 ->assertJsonPath('data.discount.type', 'fixed')
                 ->assertJsonPath('data.discount.value', 200000);
    }

    public function test_admin_can_update_product_discount_and_retrieve_inactive_discount()
    {
        $admin = User::factory()->create(['role' => 'admin', 'password_hash' => 'pwd']);
        $token = $admin->createToken('test-token')->plainTextToken;
        $category = Category::create(['name' => 'Bàn ghế', 'description' => 'Bàn ghế gỗ']);

        // Create product
        $product = \App\Models\Product::create([
            'name' => 'Bàn làm việc gỗ Sồi',
            'description' => 'Bàn xịn',
            'original_price' => 2000000,
            'price' => 1500000,
            'stock' => 10,
            'category_id' => $category->id,
            'material' => 'Gỗ Sồi',
        ]);

        // Add discount starting in future (inactive)
        $startDate = now()->addDays(2)->format('Y-m-d H:i:s');
        $endDate = now()->addWeek()->format('Y-m-d H:i:s');

        $updatePayload = [
            'name' => 'Bàn làm việc gỗ Sồi v2',
            'discount_type' => 'percent',
            'discount_value' => 15,
            'discount_start_date' => $startDate,
            'discount_end_date' => $endDate,
        ];

        // Perform PUT update (admin)
        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->putJson("/api/v1/admin/products/{$product->id}", $updatePayload);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonPath('data.discount.type', 'percent')
                 ->assertJsonPath('data.discount.value', 15);

        // Fetch as admin: should see the inactive discount
        $getAdminRes = $this->withHeaders(['Authorization' => "Bearer $token"])
                            ->getJson("/api/v1/products/{$product->id}");
        $getAdminRes->assertStatus(200)
                    ->assertJsonPath('data.discount.type', 'percent')
                    ->assertJsonPath('data.discount.value', 15);
    }

    public function test_guest_cannot_retrieve_inactive_discount()
    {
        $category = Category::create(['name' => 'Bàn ghế', 'description' => 'Bàn ghế gỗ']);

        // Create product
        $product = \App\Models\Product::create([
            'name' => 'Bàn làm việc gỗ Sồi',
            'description' => 'Bàn xịn',
            'original_price' => 2000000,
            'price' => 1500000,
            'stock' => 10,
            'category_id' => $category->id,
            'material' => 'Gỗ Sồi',
        ]);

        // Add discount starting in future (inactive)
        $product->discounts()->create([
            'discount_type' => 'percent',
            'discount_value' => 15,
            'start_date' => now()->addDays(2),
            'end_date' => now()->addWeek(),
            'status' => 'active',
        ]);

        // Fetch as guest: should NOT see the inactive discount
        $getGuestRes = $this->getJson("/api/v1/products/{$product->id}");
        $getGuestRes->assertStatus(200)
                    ->assertJsonPath('data.discount', null);
    }
}

