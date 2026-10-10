<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParteGasto extends Model
{
    protected $table = 'partes_gastos';
    protected $primaryKey = 'id_parte';
    public $timestamps = false;

    protected $fillable = ['id_parte', 'id_gasto', 'id_usuario', 'monto', 'estado'];

    protected $casts = ['estado' => 'boolean'];

    public function gasto()
    {
        return $this->belongsTo(Gasto::class, 'id_gasto', 'id_gasto');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }
}
