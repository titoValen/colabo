<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name'   => $request->name,
            'email'    => $request->email,
            'password' => $request->password,
        ]);
        $token = $user->createToken('colabo-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credenciales inválidas.',
            ], 401);
        }

        $token = $user->createToken('colabo-token')->plainTextToken;

        return response()->json([
            'user' => $user,
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

    public function destroyAccount(Request $request)
    {
        $user = $request->user();

        DB::transaction(function () use ($user) {
            $userId = $user->id;

            DB::table('payments')->where('responsible_user_id', $userId)->delete();
            DB::table('agreement_responses')->where('user_id', $userId)->delete();
            DB::table('agreements')
                ->where(function ($query) use ($userId) {
                    $query
                        ->where('creator_id', $userId)
                        ->orWhere('responsible_user_id', $userId)
                        ->orWhere('assigned_user_id', $userId);
                })
                ->delete();
            DB::table('messages')->where('user_id', $userId)->delete();
            DB::table('reminders')->where('user_id', $userId)->delete();
            DB::table('calendar_syncs')->where('user_id', $userId)->delete();
            DB::table('payment_details')->where('user_id', $userId)->delete();
            DB::table('expense_shares')->where('user_id', $userId)->delete();
            DB::table('expenses')->where('charged_by_user_id', $userId)->delete();
            DB::table('events')->where('creator_id', $userId)->delete();
            DB::table('memberships')->where('user_id', $userId)->delete();
            DB::table('personal_access_tokens')->where('tokenable_id', $userId)->delete();
            DB::table('avatar_preferences')->where('user_id', $userId)->delete();

            $user->delete();
        });

        return response()->json([
            'message' => 'Cuenta eliminada correctamente.',
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
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
                    ? 'No existe una cuenta con ese correo electrónico.'
                    : 'Si existe una cuenta con ese correo electrónico, recibirás un enlace de recuperación.',
            ], 422);
        }

        return response()->json([
            'message' => 'Si existe una cuenta con ese correo electrónico, recibirás un enlace de recuperación.',
        ], 200);
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
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => $password,
                ])->save();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'message' => app()->isLocal()
                    ? match ($status) {
                        Password::INVALID_TOKEN => 'El token de recuperación no es válido o ya expiró.',
                        Password::INVALID_USER => 'No existe una cuenta con ese correo electrónico.',
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
