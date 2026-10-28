<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $table = 'events';
    public $timestamps = false;

    protected $fillable = ['title', 'description', 'starts_at', 'group_id', 'creator_id'];

    protected $casts = [
        'starts_at' => 'datetime',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id', 'id');
    }

    public function group()
    {
        return $this->belongsTo(Group::class, 'group_id', 'id');
    }

    public function calendarSyncs()
    {
        return $this->hasMany(CalendarSync::class, 'event_id', 'id');
    }

    public function reminders()
    {
        return $this->hasMany(Reminder::class, 'event_id', 'id');
    }
}
