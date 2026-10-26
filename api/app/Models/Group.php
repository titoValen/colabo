<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    protected $table = 'groups';
    public $timestamps = false;

    protected $fillable = ['name', 'type', 'description'];

    public function users()
    {
        return $this->belongsToMany(User::class, 'memberships', 'group_id', 'user_id')
            ->using(Membership::class)
            ->withPivot('role', 'is_financially_responsible', 'calendar_enabled', 'sync_enabled', 'joined_at');
    }

    public function events()
    {
        return $this->hasMany(Event::class, 'group_id', 'id');
    }

    public function agreements()
    {
        return $this->hasMany(Agreement::class, 'group_id', 'id');
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class, 'group_id', 'id');
    }

    public function rules()
    {
        return $this->hasMany(Rule::class, 'group_id', 'id');
    }

    public function goals()
    {
        return $this->hasMany(Goal::class, 'group_id', 'id');
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'group_id', 'id');
    }

    public function invitations()
    {
        return $this->hasMany(Invitation::class, 'group_id', 'id');
    }

    public function paymentDetails()
    {
        return $this->hasMany(PaymentDetail::class, 'group_id', 'id');
    }
}
