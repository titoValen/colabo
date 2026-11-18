<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    public $timestamps = false;

    protected $table = 'notifications';

    protected $fillable = [
        'user_id',
        'type',
        'data',
        'read_at',
        'pushed_at',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'data' => 'array',
        'read_at' => 'datetime',
        'pushed_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
