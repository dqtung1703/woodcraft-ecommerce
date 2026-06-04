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
            'payment_method'   => 'cod',
            'shipping_name'    => 'John Doe',
            'shipping_phone'   => '0987654321',
            'shipping_address' => '123 Test Street, Hanoi',
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
                 ->assertJsonValidationErrors(['payment_method', 'shipping_name', 'shipping_phone', 'shipping_address']);
    }

    public function test_admin_can_update_order_status()
    {
        $user = User::factory()->create(['password_hash' => 'pwd']);
        $token = $user->createToken('test')->plainTextToken;
        $this->setupCartData($user, $token);

        $orderResponse = $this->withHeaders(['Authorization' => "Bearer $token"])
                              ->postJson('/api/v1/orders', [
                                  'payment_method'   => 'cod',
                                  'shipping_name'    => 'John Doe',
                                  'shipping_phone'   => '0987654321',
                                  'shipping_address' => '123 Test Street, Hanoi',
                              ]);
        
        $orderId = $orderResponse->json('data.order.id');

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

    public function test_admin_cannot_confirm_online_order_before_payment_is_paid()
    {
        $user = User::factory()->create(['password_hash' => 'pwd']);
        $token = $user->createToken('test')->plainTextToken;
        $this->setupCartData($user, $token);

        $orderResponse = $this->withHeaders(['Authorization' => "Bearer $token"])
                              ->postJson('/api/v1/orders', [
                                  'payment_method'   => 'vnpay',
                                  'shipping_name'    => 'John Doe',
                                  'shipping_phone'   => '0987654321',
                                  'shipping_address' => '123 Test Street, Hanoi',
                              ]);

        $orderId = $orderResponse->json('data.order.id');

        $admin = User::factory()->create(['role' => 'admin', 'password_hash' => 'pwd']);
        \Laravel\Sanctum\Sanctum::actingAs($admin);

        $response = $this->putJson("/api/v1/admin/orders/{$orderId}/status", [
            'status' => 'confirmed',
        ]);

        $response->assertStatus(422);

        $this->assertDatabaseHas('orders', [
            'id' => $orderId,
            'status' => 'pending',
        ]);
    }

    public function test_admin_can_confirm_online_order_after_payment_is_paid()
    {
        $user = User::factory()->create(['password_hash' => 'pwd']);
        $token = $user->createToken('test')->plainTextToken;
        $this->setupCartData($user, $token);

        $orderResponse = $this->withHeaders(['Authorization' => "Bearer $token"])
                              ->postJson('/api/v1/orders', [
                                  'payment_method'   => 'vnpay',
                                  'shipping_name'    => 'John Doe',
                                  'shipping_phone'   => '0987654321',
                                  'shipping_address' => '123 Test Street, Hanoi',
                              ]);

        $orderId = $orderResponse->json('data.order.id');
        \App\Models\Order::whereKey($orderId)->update(['status' => 'processing']);
        \App\Models\Payment::where('order_id', $orderId)->update(['payment_status' => 'paid']);

        $admin = User::factory()->create(['role' => 'admin', 'password_hash' => 'pwd']);
        \Laravel\Sanctum\Sanctum::actingAs($admin);

        $response = $this->putJson("/api/v1/admin/orders/{$orderId}/status", [
            'status' => 'confirmed',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('orders', [
            'id' => $orderId,
            'status' => 'confirmed',
        ]);
    }

    public function test_admin_cancel_unpaid_order_sets_payment_cancelled()
    {
        $user = User::factory()->create(['password_hash' => 'pwd']);
        $token = $user->createToken('test')->plainTextToken;
        $this->setupCartData($user, $token);

        $orderResponse = $this->withHeaders(['Authorization' => "Bearer $token"])
                              ->postJson('/api/v1/orders', [
                                  'payment_method'   => 'cod',
                                  'shipping_name'    => 'John Doe',
                                  'shipping_phone'   => '0987654321',
                                  'shipping_address' => '123 Test Street, Hanoi',
                              ]);

        $orderId = $orderResponse->json('data.order.id');

        $admin = User::factory()->create(['role' => 'admin', 'password_hash' => 'pwd']);
        \Laravel\Sanctum\Sanctum::actingAs($admin);

        $response = $this->putJson("/api/v1/admin/orders/{$orderId}/status", [
            'status' => 'cancelled',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('payments', [
            'order_id' => $orderId,
            'payment_status' => 'cancelled',
        ]);
    }
}
