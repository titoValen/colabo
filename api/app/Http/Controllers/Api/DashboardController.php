<?php

namespace App\Http\Controllers\Api;

use App\Enums\AgreementStatus;
use App\Http\Controllers\Controller;
use App\Models\Agreement;
use App\Models\Event;
use App\Models\Group;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    private const LOCAL_TZ = 'America/Argentina/Buenos_Aires';
    private const UPCOMING_DAYS = 7;
    private const COMMITMENT_WINDOW_DAYS = 30;

    public function summary(Request $request)
    {
        $user = $request->user();

        $nowLocal = CarbonImmutable::now(self::LOCAL_TZ);
        $nowUtc = $nowLocal->utc();
        $today = $nowLocal->toDateString();

        $groupIds = $user->groups()->pluck('groups.id');

        $activeGroups = $user->groups()
            ->where(function ($query) use ($nowUtc, $today) {
                $query
                    ->whereHas('agreements', fn ($q) => $q
                        ->where('status', AgreementStatus::Pending->value)
                        ->whereDate('due_date', '>=', $today))
                    ->orWhereHas('events', fn ($q) => $q
                        ->where('starts_at', '>=', $nowUtc));
            })
            ->count();

        // Solo los Pending que todavía no vencieron.
        $pendingTasks = Agreement::query()
            ->whereIn('group_id', $groupIds)
            ->where('status', AgreementStatus::Pending->value)
            ->where(function ($query) use ($today) {
                $query
                    ->whereNull('due_date')
                    ->orWhereDate('due_date', '>=', $today);
            })
            ->count();

        $upcomingEvents = Event::query()
            ->whereIn('group_id', $groupIds)
            ->where('starts_at', '>=', $nowUtc)
            ->where('starts_at', '<', $nowLocal->addDays(self::UPCOMING_DAYS)->utc())
            ->count();

        // Cerrados en la ventana: Completed o Incomplete. Cancelled queda fuera.
        $windowStart = $nowLocal->subDays(self::COMMITMENT_WINDOW_DAYS)->toDateString();

        $closed = Agreement::query()
            ->whereIn('group_id', $groupIds)
            ->where('assigned_user_id', $user->id)
            ->whereIn('status', [
                AgreementStatus::Completed->value,
                AgreementStatus::Incomplete->value,
            ])
            ->whereBetween('due_date', [$windowStart, $today]);

        $total = (clone $closed)->count();
        $completed = (clone $closed)
            ->where('status', AgreementStatus::Completed->value)
            ->count();

        $onTime = (clone $closed)
            ->where('status', AgreementStatus::Completed->value)
            ->whereRaw("DATE(CONVERT_TZ(completed_at, '+00:00', '-03:00')) <= due_date")
            ->count();

        return response()->json([
            'groups' => [
                'total' => $groupIds->count(),
                'active' => $activeGroups,
            ],
            'pending_tasks' => $pendingTasks,
            'upcoming_events' => $upcomingEvents,
            'commitments' => [
                'completed' => $completed,
                'on_time' => $onTime,
                'total' => $total,
                'rate' => $total > 0 ? (int) round($onTime / $total * 100) : null,
                'window_days' => self::COMMITMENT_WINDOW_DAYS,
            ],
        ]);
    }

    public function search(Request $request)
    {
        $user = $request->user();
        $query = trim($request->string('q')->toString());

        if (mb_strlen($query) < 2) {
            return response()->json([
                'users' => [],
                'groups' => [],
                'tasks' => [],
            ]);
        }

        $groupIds = $user->groups()->pluck('groups.id');
        $like = '%'.$query.'%';

        // Solo se muestran personas que comparten al menos un grupo con el usuario.
        $users = User::query()
            ->whereHas('groups', fn ($builder) => $builder->whereIn('groups.id', $groupIds))
            ->where('users.id', '!=', $user->id)
            ->where(function ($builder) use ($like) {
                $builder
                    ->where('name', 'like', $like)
                    ->orWhere('email', 'like', $like);
            })
            ->limit(5)
            ->get(['users.id', 'users.name', 'users.email']);

        $groups = Group::query()
            ->whereIn('groups.id', $groupIds)
            ->where(function ($builder) use ($like) {
                $builder
                    ->where('name', 'like', $like)
                    ->orWhere('type', 'like', $like)
                    ->orWhere('description', 'like', $like);
            })
            ->limit(5)
            ->get();

        $tasks = Agreement::query()
            ->with('group:id,name')
            ->whereIn('group_id', $groupIds)
            ->where(function ($builder) use ($like) {
                $builder
                    ->where('title', 'like', $like)
                    ->orWhere('description', 'like', $like);
            })
            ->limit(10)
            ->get()
            ->map(fn (Agreement $task) => [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'status' => $task->status,
                'group_id' => $task->group_id,
                'group_name' => $task->group?->name,
            ])
            ->values();

        return response()->json([
            'users' => $users,
            'groups' => $groups,
            'tasks' => $tasks,
        ]);
    }
}
