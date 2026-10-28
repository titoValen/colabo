<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invitation extends Model
{
    protected $table = 'invitations';
    public $timestamps = false;

    protected $fillable = ['group_id', 'code', 'expires_at'];

    protected $casts = ['expires_at' => 'datetime'];

    public function group()
    {
        return $this->belongsTo(Group::class, 'group_id', 'id');
    }
}
