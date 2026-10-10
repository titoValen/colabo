<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Meta extends Model
{
    protected $table = "meta";
    protected $primaryKey = 'id_meta';
    public $timestamps = false;

    protected $fillable = ['id_grupo', 'descripcion'];

    public function grupo()
    {
        return $this->belongsTo(Grupo::class, 'id_grupo', 'id_grupo');
    }
}
