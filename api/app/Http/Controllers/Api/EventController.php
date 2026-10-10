<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Evento;
use App\Models\Usuario;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $usuarioId = $request->user()->getKey();

        $eventos = Evento::query()
            ->whereHas('grupo.usuarios', function ($query) use ($usuarioId) {
                $query->where('usuarios.id_usuario', $usuarioId);
            })
            ->with(['grupo', 'creador'])
            ->orderBy('fecha_hora')
            ->get();

        return response()->json($eventos);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_grupo' => ['required', 'integer', 'exists:grupos,id_grupo'],
            'titulo' => ['required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string'],
            'fecha_hora' => ['required', 'date'],
        ]);

        $usuario = $request->user();
        $this->ensureGroupMember($usuario, $validated['id_grupo']);

        $evento = $usuario->eventosCreados()->create($validated);

        return response()->json($evento->load(['grupo', 'creador']), 201);
    }

    public function show(Request $request, Evento $evento)
    {
        $this->ensureEventGroupMember($request->user(), $evento);

        return response()->json($evento->load(['grupo', 'creador']));
    }

    public function update(Request $request, Evento $evento)
    {
        $this->ensureEventGroupMember($request->user(), $evento);

        $validated = $request->validate([
            'id_grupo' => ['sometimes', 'required', 'integer', 'exists:grupos,id_grupo'],
            'titulo' => ['sometimes', 'required', 'string', 'max:255'],
            'descripcion' => ['sometimes', 'nullable', 'string'],
            'fecha_hora' => ['sometimes', 'required', 'date'],
        ]);

        if (array_key_exists('id_grupo', $validated)) {
            $this->ensureGroupMember($request->user(), $validated['id_grupo']);
        }

        $evento->update($validated);

        return response()->json($evento->fresh()->load(['grupo', 'creador']));
    }

    public function destroy(Request $request, Evento $evento)
    {
        $this->ensureEventGroupMember($request->user(), $evento);
        $evento->delete();

        return response()->noContent();
    }

    private function ensureGroupMember(Usuario $usuario, int|string $grupoId): void
    {
        $esMiembro = $usuario->grupos()
            ->where('grupos.id_grupo', $grupoId)
            ->exists();

        if (! $esMiembro) {
            abort(403, 'No perteneces a este grupo.');
        }
    }

    private function ensureEventGroupMember(Usuario $usuario, Evento $evento): void
    {
        $esMiembro = $usuario->grupos()
            ->where('grupos.id_grupo', $evento->id_grupo)
            ->exists();

        if (! $esMiembro) {
            abort(404);
        }
    }
}
