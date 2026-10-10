<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gasto extends Model
{
    protected $table = 'gastos';

    protected $primaryKey = 'id_gasto';

    public $timestamps = false;

    protected $fillable = ['id_grupo', 'id_cargador', 'concepto', 'monto_total', 'fecha'];

    public function grupo()
    {
        return $this->belongsTo(Grupo::class, 'id_grupo', 'id_grupo');
    }

    public function cargador()
    {
        return $this->belongsTo(Usuario::class, 'id_cargador', 'id_usuario');
    }

    public function partes()
    {
        return $this->hasMany(ParteGasto::class, 'id_gasto', 'id_gasto');
    }
}
