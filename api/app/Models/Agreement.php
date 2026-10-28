<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Agreement extends Model
{
    protected $table = 'agreements';
    public $timestamps = false;

    protected $fillable = [
        'group_id',
        'creator_id',
        'responsible_user_id',
        'assigned_user_id',
        'title',
        'description',
        'due_date',
        'status',
        'created_at',
        'completed_at',
    ];

    protected $casts = [
        'due_date' => 'date',
        'created_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function group()
    {
        return $this->belongsTo(Group::class, 'group_id', 'id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id', 'id');
    }

    public function responsibleUser()
    {
        return $this->belongsTo(User::class, 'responsible_user_id', 'id');
    }

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_user_id', 'id');
    }

    public function responses()
    {
        return $this->hasMany(AgreementResponse::class, 'agreement_id', 'id');
    }

    public function reminders()
    {
        return $this->hasMany(Reminder::class, 'agreement_id', 'id');
    }
}
