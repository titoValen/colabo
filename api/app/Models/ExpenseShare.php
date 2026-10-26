<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExpenseShare extends Model
{
    protected $table = 'expense_shares';
    public $timestamps = false;

    protected $fillable = ['expense_id', 'user_id', 'amount', 'status'];

    public function expense()
    {
        return $this->belongsTo(Expense::class, 'expense_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'expense_share_id', 'id');
    }
}
