<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class Membership extends Pivot
{
    protected $table = 'memberships';

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = ['user_id', 'group_id', 'role', 'is_financially_responsible', 'calendar_enabled', 'sync_enabled', 'joined_at'];

    protected $casts = [
        'is_financially_responsible' => 'boolean',
        'calendar_enabled' => 'boolean',
        'sync_enabled' => 'boolean',
        'joined_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function group()
    {
        return $this->belongsTo(Group::class, 'group_id', 'id');
    }
}
