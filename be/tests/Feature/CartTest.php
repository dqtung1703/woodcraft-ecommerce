<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartTest extends TestCase
{
    use RefreshDatabase;

    private function createProduct()
    {
        $category = Category::create(['name' => 'Test Cat', 'description' => 'Test']);
        return Product::create([
            'name' => 'Test Product',
            'original_price' => 1500,
            'price' => 1000,
            'stock' => 10,
            'category_id' => $category->id
        ]);
    }

    public function test_user_can_add_item_to_cart()
    {
        $user = User::factory()->create(['password_hash' => 'pwd']);
        $token = $user->createToken('test')->plainTextToken;
        $product = $this->createProduct();

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->postJson('/api/v1/cart', [
                             'product_id' => $product->id,
                             'quantity' => 2
                         ]);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);
                 
        $this->assertDatabaseHas('cart_items', [
            'product_id' => $product->id,
            'quantity' => 2
        ]);
    }

    public function test_user_can_update_cart_quantity()
    {
        $user = User::factory()->create(['password_hash' => 'pwd']);
        $token = $user->createToken('test')->plainTextToken;
        $product = $this->createProduct();

        // Add
        $this->withHeaders(['Authorization' => "Bearer $token"])
             ->postJson('/api/v1/cart', [
                 'product_id' => $product->id,
                 'quantity' => 1
             ]);

        // Get Cart
        $cartResponse = $this->withHeaders(['Authorization' => "Bearer $token"])
                             ->getJson('/api/v1/cart');
        
        $itemId = $cartResponse->json('data.items.0.id');

        // Update
        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->putJson("/api/v1/cart/{$itemId}", [
                             'quantity' => 3
                         ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('cart_items', [
            'id' => $itemId,
            'quantity' => 3
        ]);
    }

    public function test_unauthenticated_user_cannot_access_cart()
    {
        $response = $this->getJson('/api/v1/cart');
        $response->assertStatus(401);
    }
}
