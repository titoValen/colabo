<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AvatarPreference extends Model
{
    protected $table = 'avatar_preferences';
    public $timestamps = false;

    protected $fillable = ['user_id', 'avatar_color', 'avatar_style', 'blobatar_shape'];

    protected $hidden = ['id', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
