<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Grupo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OnboardingController extends Controller
{
    public function store(Request $request)
    {
        $usuario = $request->user();

        if ($usuario->onboarding_completado) {
            return response()->json([
                'message' => 'El onboarding ya fue completado.',
            ], 409);
        }

        if ($request->boolean('saltar')) {
            $usuario->forceFill(['onboarding_completado' => true])->save();

            return response()->json([
                'usuario' => $usuario->fresh(),
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

        $resultado = DB::transaction(function () use ($usuario, $validated) {
            $grupo = Grupo::create($validated['grupo']);
            $usuario->grupos()->attach($grupo->getKey(), ['rol' => 'administrador']);

            $evento = $usuario->eventosCreados()->create([
                ...$validated['evento'],
                'id_grupo' => $grupo->getKey(),
            ]);

            $usuario->forceFill(['onboarding_completado' => true])->save();

            return [
                'usuario' => $usuario->fresh(),
                'grupo' => $grupo,
                'evento' => $evento,
            ];
        });

        return response()->json($resultado, 201);
    }
}
