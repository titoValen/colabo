<?php

namespace App\Models;

use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Auth\Passwords\CanResetPassword as CanResetPasswordTrait;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Notifications\ResetPasswordNotification;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements CanResetPassword
{
    use HasApiTokens, CanResetPasswordTrait, Notifiable;

    protected $table = 'users';
    protected $fillable = ['name', 'email', 'password', 'notifications_enabled', 'onboarding_completed'];

    protected $hidden = ['password'];

    protected $casts = [
        'password' => 'hashed',
        'notifications_enabled' => 'boolean',
        'onboarding_completed' => 'boolean',
    ];

    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new ResetPasswordNotification($token));
    }

    public function groups()
    {
        return $this->belongsToMany(Group::class, 'memberships', 'user_id', 'group_id')
            ->using(Membership::class)
            ->withPivot('role', 'is_financially_responsible', 'calendar_enabled', 'sync_enabled', 'joined_at');
    }

    public function createdEvents()
    {
        return $this->hasMany(Event::class, 'creator_id', 'id');
    }

    public function createdAgreements()
    {
        return $this->hasMany(Agreement::class, 'creator_id', 'id');
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'user_id', 'id');
    }

    public function reminders()
    {
        return $this->hasMany(Reminder::class, 'user_id', 'id');
    }

    public function paymentDetails()
    {
        return $this->hasMany(PaymentDetail::class, 'user_id', 'id');
    }

    public function chargedExpenses()
    {
        return $this->hasMany(Expense::class, 'charged_by_user_id', 'id');
    }

    public function expenseShares()
    {
        return $this->hasMany(ExpenseShare::class, 'user_id', 'id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'responsible_user_id', 'id');
    }

    public function calendarSyncs()
    {
        return $this->hasMany(CalendarSync::class, 'user_id', 'id');
    }

    public function agreementResponses()
    {
        return $this->hasMany(AgreementResponse::class, 'user_id', 'id');
    }
}
