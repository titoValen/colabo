<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rule extends Model
{
    protected $table = 'rules';
    public $timestamps = false;

    protected $fillable = ['group_id', 'description'];

    public function group()
    {
        return $this->belongsTo(Group::class, 'group_id', 'id');
    }
}
