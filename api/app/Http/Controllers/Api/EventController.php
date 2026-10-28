<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\User;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->getKey();

        $events = Event::query()
            ->whereHas('group.users', function ($query) use ($userId) {
                $query->where('users.id', $userId);
            })
            ->with(['group', 'creator'])
            ->orderBy('starts_at')
            ->get();

        return response()->json($events);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'group_id' => ['required', 'integer', 'exists:groups,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'starts_at' => ['required', 'date'],
        ]);

        $user = $request->user();
        $this->ensureGroupMember($user, $validated['group_id']);

        $event = $user->createdEvents()->create($validated);

        return response()->json($event->load(['group', 'creator']), 201);
    }

    public function show(Request $request, Event $event)
    {
        $this->ensureEventGroupMember($request->user(), $event);

        return response()->json($event->load(['group', 'creator']));
    }

    public function update(Request $request, Event $event)
    {
        $this->ensureEventGroupMember($request->user(), $event);

        $validated = $request->validate([
            'group_id' => ['sometimes', 'required', 'integer', 'exists:groups,id'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'starts_at' => ['sometimes', 'required', 'date'],
        ]);

        if (array_key_exists('group_id', $validated)) {
            $this->ensureGroupMember($request->user(), $validated['group_id']);
        }

        $event->update($validated);

        return response()->json($event->fresh()->load(['group', 'creator']));
    }

    public function destroy(Request $request, Event $event)
    {
        $this->ensureEventGroupMember($request->user(), $event);
        $event->delete();

        return response()->noContent();
    }

    private function ensureGroupMember(User $user, int|string $groupId): void
    {
        $isMember = $user->groups()
            ->where('groups.id', $groupId)
            ->exists();

        if (! $isMember) {
            abort(403, 'No perteneces a este grupo.');
        }
    }

    private function ensureEventGroupMember(User $user, Event $event): void
    {
        $isMember = $user->groups()
            ->where('groups.id', $event->group_id)
            ->exists();

        if (! $isMember) {
            abort(404);
        }
    }
}
