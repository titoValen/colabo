<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Minishlink\WebPush\ContentEncoding;
use NotificationChannels\WebPush\PushSubscription;

class PushSubscriptionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'endpoint' => [
                'required',
                'string',
                'url:https',
                'max:'.PushSubscription::ENDPOINT_MAX_LENGTH,
            ],
            'keys.p256dh' => [
                'bail',
                'required',
                'string',
                'regex:/\A[A-Za-z0-9_-]+\z/',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if (!self::isBase64UrlKeyOfLength($value, 65)) {
                        $fail('La clave pública push no tiene un formato válido.');
                    }
                },
            ],
            'keys.auth' => [
                'bail',
                'required',
                'string',
                'regex:/\A[A-Za-z0-9_-]+\z/',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if (!self::isBase64UrlKeyOfLength($value, 16)) {
                        $fail('El token de autenticación push no tiene un formato válido.');
                    }
                },
            ],
            'contentEncoding' => [
                'nullable',
                Rule::in([
                    ContentEncoding::aes128gcm->value,
                    ContentEncoding::aesgcm->value,
                ]),
            ],
        ]);

        $request->user()->updatePushSubscription(
            $validated['endpoint'],
            $validated['keys']['p256dh'],
            $validated['keys']['auth'],
            $validated['contentEncoding'] ?? ContentEncoding::aes128gcm->value,
        );

        return response()->json(['message' => 'Suscripción guardada.'], 201);
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'endpoint' => [
                'required',
                'string',
                'url:https',
                'max:'.PushSubscription::ENDPOINT_MAX_LENGTH,
            ],
        ]);

        $request->user()->deletePushSubscription($validated['endpoint']);

        return response()->noContent();
    }

    private static function isBase64UrlKeyOfLength(mixed $value, int $length): bool
    {
        if (!is_string($value)) {
            return false;
        }

        $base64 = strtr($value, '-_', '+/');
        $base64 .= str_repeat('=', (4 - strlen($base64) % 4) % 4);
        $decoded = base64_decode($base64, true);

        return $decoded !== false && strlen($decoded) === $length;
    }
}
