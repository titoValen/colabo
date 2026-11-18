<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Jobs\DispatchUserNotification;
use App\Models\Notification;

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

            $message->recipients()->createMany((
                $recipientIds->map(fn($id) => ['user_id' => $id])->all()
            ));

            foreach ($recipientIds as $recipientId) {
                $notification = Notification::create([
                    'user_id' => $recipientId,
                    'type' => 'group_message',
                    'data' => [
                        'message_id' => $message->id,
                        'group_id' => $message->group_id,
                        'from' => $user->name,
                        'preview' => mb_substr($message->content, 0, 120),
                    ],
                ]);

                DispatchUserNotification::dispatch($notification->id)->afterCommit();
            }

            return $message;
        });

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
