<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Regla extends Model
{
    protected $table = 'reglas';

    protected $primaryKey = 'id_regla';

    public $timestamps = false;

    protected $fillable = ['id_grupo', 'descripcion'];

    public function grupo()
    {
        return $this->belongsTo(Grupo::class, 'id_grupo', 'id_grupo');
    }
}
