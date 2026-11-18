<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'group_id' => ['required', 'integer', 'exists:groups,id'],
            'content' => ['required', 'string'],
            'notify_user_ids' => ['nullable', 'array', 'max:100'],
            'notify_user_ids.*' => ['integer', 'distinct', 'exists:users,id'],
        ]);

        $user = $request->user();
        $this->ensureGroupMember($user, $validated['group_id']);

        $candidateIds = collect($validated['notify_user_ids'] ?? [])
            ->map(fn($id) => (int) $id)
            ->reject(fn($id) => $id === (int) $user->id)
            ->values();
        $recipientIds = DB::table('memberships')
            ->where('group_id', $validated['group_id'])
            ->whereIn('user_id', $candidateIds)
            ->pluck('user_id')
            ->map(fn($id) => (int) $id)
            ->values();

        $message = DB::transaction(function () use ($user, $validated, $recipientIds) {
            $message = Message::create([
                'group_id' => $validated['group_id'],
                'user_id' => $user->id,
                'content' => $validated['content'],
                'sent_at' => now(),
            ]);

            $now = now();
            if ($recipientIds->isNotEmpty()) {
                DB::table('message_recipients')->insert(
                    $recipientIds->map(fn($id) => [
                        'message_id' => $message->id,
                        'user_id' => $id,
                    ])->all()
                );

                DB::table('notifications')->insert(
                    $recipientIds->map(fn($id) => [
                        'user_id' => $id,
                        'type' => 'group_message',
                        'data' => json_encode([
                            'message_id' => $message->id,
                            'group_id' => $message->group_id,
                        ], JSON_THROW_ON_ERROR),
                        'created_at' => $now,
                    ])->all()
                );
            }

            return $message;
        });

        // Aquí se despacha el job que decide: broadcast si está online, push si no.

        return response()->json($message, 201);
    }

    private function ensureGroupMember(User $user, int|string $groupId): void
    {
        $isMember = $user->groups()
            ->where('groups.id', $groupId)
            ->exists();

        if (!$isMember) {
            abort(403, 'No perteneces a este grupo.');
        }
    }
}
