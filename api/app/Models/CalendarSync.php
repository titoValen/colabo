<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class CalendarSync extends Pivot
{
    protected $table = 'calendar_syncs';

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = ['event_id', 'user_id', 'status', 'synced_at'];

    protected $casts = ['synced_at' => 'datetime'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id', 'id');
    }
}
