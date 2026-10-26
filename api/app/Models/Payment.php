<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $table = 'payments';
    public $timestamps = false;

    protected $fillable = ['expense_share_id', 'responsible_user_id', 'method', 'status', 'reported_at', 'resolved_at'];

    protected $casts = [
        'status' => 'string',
        'reported_at' => 'datetime',
        'resolved_at' => 'datetime',
    ];

    public function share()
    {
        return $this->belongsTo(ExpenseShare::class, 'expense_share_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'responsible_user_id', 'id');
    }
}
