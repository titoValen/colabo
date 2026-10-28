<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class AgreementResponse extends Pivot
{
    protected $table = "agreement_responses";
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = ['agreement_id', 'user_id', 'decision', 'responded_at'];

    protected $casts = [
        'decision' => 'string',
        'responded_at' => 'datetime'
    ];

    public function agreement()
    {
        return $this->belongsTo(Agreement::class, 'agreement_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
