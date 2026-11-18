<?php

namespace App\Notifications;

use App\Models\Notification as UserNotification;
use Illuminate\Notifications\Notification as LaravelNotification;
use NotificationChannels\WebPush\WebPushChannel;
use NotificationChannels\WebPush\WebPushMessage;

class PushNotification extends LaravelNotification
{
    public function __construct(private readonly UserNotification $notification)
    {
    }

    public function via(object $notifiable): array
    {
        return [WebPushChannel::class];
    }

    public function toWebPush(object $notifiable, LaravelNotification $notification): WebPushMessage
    {
        $data = $this->notification->data ?? [];

        [$title, $body, $url] = match ($this->notification->type) {
            'group_message' => [
                'Mensaje de '.($data['from'] ?? 'un miembro del grupo'),
                $data['preview'] ?? 'Te enviaron un mensaje',
                isset($data['group_id']) ? '/grupos/'.$data['group_id'] : '/dashboard',
            ],
            'payment_due' => ['Pago pendiente', 'Tienes un pago pendiente', '/gastos'],
            'event_reminder' => [
                'Recordatorio de evento',
                'Recordatorio: '.($data['event_name'] ?? ''),
                '/eventos/',
            ],
            default => [
                'Notificación desconocida',
                'No se reconoce el tipo de notificación',
                '/dashboard',
            ],
        };

        return (new WebPushMessage)
            ->title($title)
            ->body($body)
            ->icon('/web-app-manifest-192x192.png')
            ->badge('/favicon-96x96.png')
            ->tag('notification-'.$this->notification->id)
            ->data(['url' => $url]);
    }
}
