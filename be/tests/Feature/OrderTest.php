<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    private function setupCartData($user, $token)
    {
        $category = Category::create(['name' => 'Test Cat', 'description' => 'Test']);
        $product = Product::create([
            'name' => 'Test Product',
            'original_price' => 1500,
            'price' => 1000,
            'stock' => 10,
            'category_id' => $category->id
        ]);

        $this->withHeaders(['Authorization' => "Bearer $token"])
             ->postJson('/api/v1/cart', [
                 'product_id' => $product->id,
                 'quantity' => 1
             ]);
    }

    public function test_user_can_checkout_order_from_cart()
    {
        $user = User::factory()->create(['password_hash' => 'pwd']);
        $token = $user->createToken('test')->plainTextToken;
        $this->setupCartData($user, $token);

        $payload = [
            'payment_method' => 'cod'
        ];

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->postJson('/api/v1/orders', $payload);

        $response->assertStatus(201)
                 ->assertJsonPath('success', true);
                 
        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id
        ]);
    }

    public function test_checkout_validation_errors()
    {
        $user = User::factory()->create(['password_hash' => 'pwd']);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->postJson('/api/v1/orders', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['payment_method']);
    }

    public function test_admin_can_update_order_status()
    {
        $user = User::factory()->create(['password_hash' => 'pwd']);
        $token = $user->createToken('test')->plainTextToken;
        $this->setupCartData($user, $token);

        $orderResponse = $this->withHeaders(['Authorization' => "Bearer $token"])
                              ->postJson('/api/v1/orders', [
                                  'payment_method' => 'cod'
                              ]);
        
        $orderId = $orderResponse->json('data.id');

        $admin = User::factory()->create(['role' => 'admin', 'password_hash' => 'pwd']);
        \Laravel\Sanctum\Sanctum::actingAs($admin);

        $response = $this->putJson("/api/v1/admin/orders/{$orderId}/status", [
                             'status' => 'confirmed'
                         ]);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);

        $this->assertDatabaseHas('orders', [
            'id' => $orderId,
            'status' => 'confirmed'
        ]);
    }

    public function test_user_cannot_update_order_status()
    {
        $user = User::factory()->create(['password_hash' => 'pwd', 'role' => 'customer']);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->putJson("/api/v1/admin/orders/1/status", [
                             'status' => 'confirmed'
                         ]);

        $response->assertStatus(403);
    }
}
