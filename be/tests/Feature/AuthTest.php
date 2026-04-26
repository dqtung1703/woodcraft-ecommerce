<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_successfully()
    {
        $payload = [
            'name' => 'John Doe',
            'email' => 'john@woodcraft.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'phone' => '0912345678',
            'address' => '123 Test St'
        ];

        $response = $this->postJson('/api/v1/register', $payload);

        $response->assertStatus(201)
                 ->assertJsonPath('success', true);
                 
        $this->assertDatabaseHas('users', ['email' => 'john@woodcraft.com']);
    }

    public function test_register_validation_errors()
    {
        $response = $this->postJson('/api/v1/register', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    public function test_user_can_login_with_valid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'login@woodcraft.com',
            'password_hash' => 'password123' // Vì model User cast password_hash là 'hashed'
        ]);

        $response = $this->postJson('/api/v1/login', [
            'email' => 'login@woodcraft.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonStructure(['data' => ['user', 'token']]);
    }

    public function test_login_fails_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'wrong@woodcraft.com',
            'password_hash' => 'password123'
        ]);

        $response = $this->postJson('/api/v1/login', [
            'email' => 'wrong@woodcraft.com',
            'password' => 'wrongpassword'
        ]);

        $response->assertStatus(401);
    }

    public function test_user_can_get_profile_with_token()
    {
        $user = User::factory()->create(['password_hash' => 'pwd']);
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->getJson('/api/v1/profile');

        $response->assertStatus(200)
                 ->assertJsonPath('data.email', $user->email);
    }

    public function test_unauthenticated_user_cannot_get_profile()
    {
        $response = $this->getJson('/api/v1/profile');
        $response->assertStatus(401);
    }
}
