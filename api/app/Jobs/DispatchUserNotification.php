<?php

namespace App\Jobs;

use App\Models\Notification;
use App\Models\User;
use App\Notifications\PushNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Minishlink\WebPush\MessageSentReport;
use NotificationChannels\WebPush\WebPushChannel;
use RuntimeException;

class DispatchUserNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public int $notificationId) {}

    public function handle(): void
    {
        $shouldRetry = DB::transaction(function (): bool {
            $notification = Notification::query()
                ->lockForUpdate()
                ->find($this->notificationId);

            if (!$notification || $notification->pushed_at) {
                return false;
            }

            $notification->load('user');
            $user = $notification->user;

            if (!$user || !$user->notifications_enabled || $this->isOnline($user->id)) {
                return false;
            }

            $reports = app(WebPushChannel::class)->send(
                $user,
                new PushNotification($notification),
            );

            if (collect($reports)->contains(
                static fn (MessageSentReport $report): bool => $report->isSuccess(),
            )) {
                $notification->forceFill(['pushed_at' => now()])->save();

                return false;
            }

            return $reports !== [];
        });

        if ($shouldRetry) {
            throw new RuntimeException(
                "Web Push delivery failed for notification {$this->notificationId}.",
            );
        }
    }

    private function isOnline(int $userId): bool
    {
        return DB::table('user_presences')
            ->where('user_id', $userId)
            ->where('last_seen_at', '>=', now()->subSeconds(60))
            ->exists();
    }
}
