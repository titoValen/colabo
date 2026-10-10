<?php

namespace Tests\Feature;

use App\Models\Evento;
use App\Models\Grupo;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class EventControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_member_can_list_create_view_update_and_delete_group_events(): void
    {
        $usuario = Usuario::create([
            'nombre' => 'Valentina',
            'email' => 'valentina@example.com',
            'password' => 'password',
        ]);
        $grupo = Grupo::create(['nombre' => 'Casa']);
        $usuario->grupos()->attach($grupo->id_grupo);
        Sanctum::actingAs($usuario);

        $payload = [
            'id_grupo' => $grupo->id_grupo,
            'titulo' => 'Cena',
            'descripcion' => 'Cena del grupo',
            'fecha_hora' => '2026-10-10 20:00:00',
        ];

        $this->postJson('/api/eventos', $payload)
            ->assertCreated()
            ->assertJsonPath('titulo', 'Cena')
            ->assertJsonPath('id_creador', $usuario->id_usuario);

        $evento = Evento::firstOrFail();

        $this->getJson('/api/eventos')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.id_evento', $evento->id_evento);

        $this->getJson("/api/eventos/{$evento->id_evento}")
            ->assertOk()
            ->assertJsonPath('id_evento', $evento->id_evento);

        $this->patchJson("/api/eventos/{$evento->id_evento}", [
            'titulo' => 'Cena actualizada',
        ])
            ->assertOk()
            ->assertJsonPath('titulo', 'Cena actualizada');

        $this->deleteJson("/api/eventos/{$evento->id_evento}")
            ->assertNoContent();

        $this->assertDatabaseMissing('eventos', ['id_evento' => $evento->id_evento]);
    }

    public function test_user_cannot_create_or_view_events_for_another_users_group(): void
    {
        $usuario = Usuario::create([
            'nombre' => 'Valentina',
            'email' => 'valentina@example.com',
            'password' => 'password',
        ]);
        $otroUsuario = Usuario::create([
            'nombre' => 'Alex',
            'email' => 'alex@example.com',
            'password' => 'password',
        ]);
        $grupo = Grupo::create(['nombre' => 'Privado']);
        $evento = Evento::create([
            'id_grupo' => $grupo->id_grupo,
            'id_creador' => $otroUsuario->id_usuario,
            'titulo' => 'Evento privado',
            'fecha_hora' => '2026-10-10 20:00:00',
        ]);
        Sanctum::actingAs($usuario);

        $this->postJson('/api/eventos', [
            'id_grupo' => $grupo->id_grupo,
            'titulo' => 'No autorizado',
            'fecha_hora' => '2026-10-10 20:00:00',
        ])->assertForbidden();

        $this->getJson("/api/eventos/{$evento->id_evento}")
            ->assertNotFound();

        $this->getJson('/api/eventos')
            ->assertOk()
            ->assertExactJson([]);
    }
}
