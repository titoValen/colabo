<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $table = 'expenses';
    public $timestamps = false;

    protected $fillable = ['group_id', 'charged_by_user_id', 'description', 'total_amount', 'date'];

    public function group()
    {
        return $this->belongsTo(Group::class, 'group_id', 'id');
    }

    public function chargedByUser()
    {
        return $this->belongsTo(User::class, 'charged_by_user_id', 'id');
    }

    public function shares()
    {
        return $this->hasMany(ExpenseShare::class, 'expense_id', 'id');
    }
}
