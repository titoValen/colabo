<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdatePasswordRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

class PasswordController extends Controller
{
    public function update(UpdatePasswordRequest $request)
    {
        $user = $request->user();

        if (! Hash::check($request->input('current_password'), $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => 'La contraseña actual no es correcta.',
            ]);
        }

        $user->forceFill(['password' => $request->input('password')])->save();

        // Cierra las demás sesiones abiertas y conserva la actual.
        $tokens = $user->tokens();
        $currentToken = $user->currentAccessToken();

        if ($currentToken instanceof PersonalAccessToken) {
            $tokens->where('id', '!=', $currentToken->id);
        }

        $tokens->delete();

        return response()->json([
            'message' => 'Contraseña actualizada.',
        ]);
    }
}
