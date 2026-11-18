<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class PasswordUpdateTest extends TestCase
{
    use RefreshDatabase;

    private function createUser(): User
    {
        return User::create([
            'name' => 'Nico Test',
            'email' => 'nico@example.com',
            'password' => 'password123',
        ]);
    }

    private function authHeader(User $user, string $device = 'web'): array
    {
        return ['Authorization' => 'Bearer '.$user->createToken($device)->plainTextToken];
    }

    private function payload(array $overrides = []): array
    {
        return $overrides + [
            'current_password' => 'password123',
            'password' => 'nueva-clave-456',
            'password_confirmation' => 'nueva-clave-456',
        ];
    }

    public function test_requires_authentication(): void
    {
        $this->putJson('/api/password', $this->payload())->assertUnauthorized();
    }

    public function test_changes_the_password(): void
    {
        $user = $this->createUser();

        $this->withHeaders($this->authHeader($user))
            ->putJson('/api/password', $this->payload())
            ->assertOk()
            ->assertJsonPath('message', 'Contraseña actualizada.');

        $this->assertTrue(Hash::check('nueva-clave-456', $user->fresh()->password));
    }

    public function test_the_new_password_works_for_login_and_the_old_one_does_not(): void
    {
        $user = $this->createUser();

        $this->withHeaders($this->authHeader($user))->putJson('/api/password', $this->payload())->assertOk();

        $this->postJson('/api/login', ['email' => 'nico@example.com', 'password' => 'nueva-clave-456'])->assertOk();
        $this->postJson('/api/login', ['email' => 'nico@example.com', 'password' => 'password123'])->assertUnauthorized();
    }

    public function test_rejects_a_wrong_current_password(): void
    {
        $user = $this->createUser();

        $this->withHeaders($this->authHeader($user))
            ->putJson('/api/password', $this->payload(['current_password' => 'incorrecta']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('current_password');

        $this->assertTrue(Hash::check('password123', $user->fresh()->password));
    }

    public function test_rejects_a_mismatched_confirmation(): void
    {
        $this->withHeaders($this->authHeader($this->createUser()))
            ->putJson('/api/password', $this->payload(['password_confirmation' => 'otra-cosa-789']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('password');
    }

    public function test_rejects_a_password_shorter_than_8_characters(): void
    {
        $this->withHeaders($this->authHeader($this->createUser()))
            ->putJson('/api/password', $this->payload(['password' => 'corta', 'password_confirmation' => 'corta']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('password');
    }

    public function test_rejects_reusing_the_current_password(): void
    {
        $this->withHeaders($this->authHeader($this->createUser()))
            ->putJson('/api/password', $this->payload([
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('password');
    }

    public function test_closes_other_sessions_but_keeps_the_current_one(): void
    {
        $user = $this->createUser();
        $user->createToken('otro-dispositivo');
        $headers = $this->authHeader($user, 'este-dispositivo');

        $this->assertSame(2, $user->tokens()->count());

        $this->withHeaders($headers)->putJson('/api/password', $this->payload())->assertOk();

        $this->assertSame(['este-dispositivo'], $user->tokens()->pluck('name')->all());
    }

    public function test_limits_repeated_attempts(): void
    {
        $user = $this->createUser();
        $headers = $this->authHeader($user);

        foreach (range(1, 5) as $attempt) {
            $this->withHeaders($headers)
                ->putJson('/api/password', $this->payload(['current_password' => 'incorrecta']))
                ->assertUnprocessable();
        }

        $this->withHeaders($headers)
            ->putJson('/api/password', $this->payload(['current_password' => 'incorrecta']))
            ->assertStatus(429);
    }
}
