<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class MessageRecipient extends Pivot
{
    public $incrementing = false;

    public $timestamps = false;

    protected $table = 'message_recipients';

    protected $fillable = [
        'message_id',
        'user_id',
        'read_at',
        'pushed_at',
    ];

    protected $casts = [
        'read_at' => 'datetime',
        'pushed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function message()
    {
        return $this->belongsTo(Message::class, 'message_id', 'id');
    }
}
