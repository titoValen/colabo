<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DatosCobro extends Model
{
    protected $table = "datos-cobro";
    protected $primaryKey = 'id_datos';
    public $timestamps = false;

    protected $fillable = ['id_grupo', 'id_usuario', 'tipo', 'valor'];

    public function grupo()
    {
        return $this->belongsTo(Grupo::class, 'id_grupo', 'id_grupo');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }
}
