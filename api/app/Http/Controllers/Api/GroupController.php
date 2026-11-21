<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGroupRequest;
use App\Models\Agreement;
use App\Models\Group;
use App\Models\Invitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GroupController extends Controller
{
    private const INVITATION_DAYS = 7;

    public function index(Request $request)
    {
        $groups = $request->user()->groups()
            ->with('users')
            ->withCount('users')
            ->orderByDesc('groups.id')
            ->get()
            ->map(function (Group $group) {
                // Solo los primeros integrantes, para mostrar sus avatares en la tarjeta.
                $group->setAttribute('members_preview', $group->users->take(4)->map(fn ($member) => [
                    'id' => $member->getKey(),
                    'name' => $member->name,
                    'avatar_preference' => $member->avatarPreference,
                ])->values());
                $group->unsetRelation('users');

                return $group;
            });

        return response()->json($groups);
    }

    public function store(StoreGroupRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();
        $expenses = $data['expenses'] ?? null;
        $expiresAt = now()->addDays(self::INVITATION_DAYS);

        $group = DB::transaction(function () use ($user, $data, $expenses, $expiresAt) {
            $group = Group::create([
                'name' => $data['name'],
                'type' => $data['category'],
                'description' => $data['description'] ?? null,
                'color' => $data['color'],
                'avatar_preset' => $data['avatar_preset'],
                'purpose' => $data['purpose'] ?? null,
                'member_limit' => $data['member_limit'],
                'members_can_invite' => $data['members_can_invite'],
                'members_can_create_tasks' => $data['members_can_create_tasks'],
                'members_can_add_expenses' => $data['members_can_add_expenses'],
                'expenses_enabled' => $expenses !== null,
                'currency' => $expenses['currency'] ?? null,
                'budget' => $expenses['budget'] ?? null,
                'expense_split' => $expenses['split'] ?? null,
                'contribution_amount' => ($expenses['split'] ?? null) === 'contribution'
                    ? $expenses['contribution_amount']
                    : null,
            ]);

            // El creador queda como administrador automáticamente.
            $user->groups()->attach($group->getKey(), ['role' => 'admin']);

            foreach ($data['goals'] ?? [] as $description) {
                $group->goals()->create(['description' => $description]);
            }

            foreach ($data['rules'] ?? [] as $rule) {
                $group->rules()->create($rule);
            }

            foreach ($data['important_dates'] ?? [] as $date) {
                $group->events()->create([
                    'creator_id' => $user->getKey(),
                    'title' => $date['title'],
                    // Mediodía: evita que la fecha se corra de día según la zona horaria.
                    'starts_at' => $date['date'].' 12:00:00',
                ]);
            }

            if (! empty($data['task'])) {
                // Hasta que se sumen integrantes, el responsable es quien crea el grupo.
                Agreement::create([
                    'group_id' => $group->getKey(),
                    'creator_id' => $user->getKey(),
                    'responsible_user_id' => $user->getKey(),
                    'assigned_user_id' => $user->getKey(),
                    'title' => $data['task']['title'],
                    'description' => $data['task']['description'] ?? null,
                    'due_date' => $data['task']['due_date'] ?? null,
                ]);
            }

            if (! empty($data['invite_code'])) {
                $group->invitations()->create([
                    'code' => $data['invite_code'],
                    'expires_at' => $expiresAt,
                ]);
            }

            foreach ($data['invitees'] ?? [] as $invitee) {
                $group->invitations()->create([
                    'code' => $this->generateInvitationCode(),
                    'invitee' => $invitee,
                    'expires_at' => $expiresAt,
                ]);
            }

            return $group;
        });

        return response()->json(['group' => $group->fresh()], 201);
    }

    public function show(Request $request, int $group)
    {
        $group = $request->user()->groups()->whereKey($group)->firstOrFail();
        $role = $group->pivot->role;

        return response()->json([
            'group' => $group,
            'my_role' => $role,
            'members' => $group->users()->get()->map(fn ($member) => [
                'id' => $member->getKey(),
                'name' => $member->name,
                'role' => $member->pivot->role,
                'avatar_preference' => $member->avatarPreference,
            ])->values(),
            'goals' => $group->goals()->get(),
            'rules' => $group->rules()->get(),
            'events' => $group->events()->orderBy('starts_at')->get(),
            'tasks' => $group->agreements()->orderBy('id')->get(),
            'invitations' => $role === 'admin' ? $group->invitations()->get() : [],
        ]);
    }

    public function storeImages(Request $request, int $group)
    {
        $group = $request->user()->groups()
            ->whereKey($group)
            ->wherePivot('role', 'admin')
            ->firstOrFail();

        $request->validate([
            'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'cover' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        foreach (['avatar', 'cover'] as $field) {
            if (! $request->hasFile($field)) {
                continue;
            }

            $column = $field.'_path';

            if ($group->{$column}) {
                Storage::disk('public')->delete($group->{$column});
            }

            $group->{$column} = $request->file($field)->store('groups/'.$group->getKey(), 'public');
        }

        $group->save();

        return response()->json(['group' => $group->fresh()]);
    }

    private function generateInvitationCode(): string
    {
        do {
            $code = Str::lower(Str::random(12));
        } while (Invitation::where('code', $code)->exists());

        return $code;
    }
}
