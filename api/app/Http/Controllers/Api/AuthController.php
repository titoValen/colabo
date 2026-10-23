<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $usuario = Usuario::create([
            'nombre'   => $request->nombre,
            'email'    => $request->email,
            'password' => $request->password,
        ]);
        $token = $usuario->createToken('colabo-token')->plainTextToken;

        return response()->json([
            'usuario' => $usuario,
            'token' => $token,
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        $usuario = Usuario::where('email', $request->email)->first();

        if (! $usuario || ! Hash::check($request->password, $usuario->password)) {
            return response()->json([
                'message' => 'Credenciales inválidas.',
            ], 401);
        }

        $token = $usuario->createToken('colabo-token')->plainTextToken;

        return response()->json([
            'usuario' => $usuario,
            'token' => $token,
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada correctamente.',
        ], 200);
    }

    public function me(Request $request)
    {
        return response()->json([
            'usuario' => $request->user(),
        ], 200);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status !== Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => app()->isLocal() && $status === Password::INVALID_USER
                    ? 'No existe una cuenta con ese email.'
                    : 'Si existe una cuenta con ese email, recibirás un enlace de recuperación.',
            ], 422);
        }

        return response()->json([
            'message' => 'Si existe una cuenta con ese email, recibirás un enlace de recuperación.',
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (Usuario $usuario, string $password) {
                $usuario->forceFill([
                    'password' => $password,
                ])->save();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'message' => app()->isLocal()
                    ? match ($status) {
                        Password::INVALID_TOKEN => 'El token de recuperación no es válido o ya expiró.',
                        Password::INVALID_USER => 'No existe una cuenta con ese email.',
                        default => 'No se pudo restablecer la contraseña.',
                    }
                    : 'El enlace de recuperación no es válido o ya expiró.',
            ], 422);
        }

        return response()->json([
            'message' => 'Contraseña restablecida correctamente.',
        ]);
    }
}
