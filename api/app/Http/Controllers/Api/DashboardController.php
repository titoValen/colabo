<?php

namespace App\Http\Controllers\Api;

use App\Enums\AgreementStatus;
use App\Http\Controllers\Controller;
use App\Models\Agreement;
use App\Models\Event;
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
            ->where('assigned_user_id', $user->id)
            ->where('status', AgreementStatus::Pending->value)
            ->whereDate('due_date', '>=', $today)
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
                'on_time' => $onTime,
                'total' => $total,
                'rate' => $total > 0 ? (int) round($onTime / $total * 100) : null,
                'window_days' => self::COMMITMENT_WINDOW_DAYS,
            ],
        ]);
    }
}