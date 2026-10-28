<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OnboardingController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->onboarding_completed) {
            return response()->json([
                'message' => 'El onboarding ya fue completado.',
            ], 409);
        }

        if ($request->boolean('saltar')) {
            $user->forceFill(['onboarding_completed' => true])->save();

            return response()->json([
                'user' => $user->fresh(),
            ]);
        }

        $validated = $request->validate([
            'grupo.nombre' => ['required', 'string', 'max:255'],
            'grupo.tipo' => ['required', 'string', 'max:255'],
            'grupo.descripcion' => ['nullable', 'string'],
            'evento.titulo' => ['required', 'string', 'max:255'],
            'evento.fecha_hora' => ['required', 'date'],
            'evento.descripcion' => ['nullable', 'string'],
        ]);

        $resultado = DB::transaction(function () use ($user, $validated) {
            $grupo = Group::create([
                'name' => $validated['grupo']['nombre'],
                'type' => $validated['grupo']['tipo'],
                'description' => $validated['grupo']['descripcion'] ?? null,
            ]);
            $user->groups()->attach($grupo->getKey(), ['role' => 'admin']);

            $evento = $user->createdEvents()->create([
                'title' => $validated['evento']['titulo'],
                'starts_at' => $validated['evento']['fecha_hora'],
                'description' => $validated['evento']['descripcion'] ?? null,
                'group_id' => $grupo->getKey(),
            ]);

            $user->forceFill(['onboarding_completed' => true])->save();

            return [
                'user' => $user->fresh(),
                'grupo' => $grupo,
                'evento' => $evento,
            ];
        });

        return response()->json($resultado, 201);
    }
}
