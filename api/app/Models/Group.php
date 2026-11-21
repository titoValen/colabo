<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    protected $table = 'groups';
    public $timestamps = false;

    protected $fillable = [
        'name',
        'type',
        'description',
        'color',
        'avatar_preset',
        'avatar_path',
        'cover_path',
        'purpose',
        'member_limit',
        'members_can_invite',
        'members_can_create_tasks',
        'members_can_add_expenses',
        'expenses_enabled',
        'currency',
        'budget',
        'expense_split',
        'contribution_amount',
    ];

    protected $hidden = ['avatar_path', 'cover_path'];

    protected $appends = ['avatar_url', 'cover_url'];

    protected $casts = [
        'member_limit' => 'integer',
        'members_can_invite' => 'boolean',
        'members_can_create_tasks' => 'boolean',
        'members_can_add_expenses' => 'boolean',
        'expenses_enabled' => 'boolean',
        'budget' => 'decimal:2',
        'contribution_amount' => 'decimal:2',
    ];

    protected function avatarUrl(): Attribute
    {
        return Attribute::get(
            fn () => $this->avatar_path ? asset('storage/'.$this->avatar_path) : null
        );
    }

    protected function coverUrl(): Attribute
    {
        return Attribute::get(
            fn () => $this->cover_path ? asset('storage/'.$this->cover_path) : null
        );
    }

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
