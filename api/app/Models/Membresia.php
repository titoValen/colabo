<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class Membresia extends Pivot
{
    protected $table = 'membresias';

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = ['id_usuario', 'id_grupo', 'rol', 'responsable_plata', 'calendario_activo', 'acepta_sincronizacion', 'fecha_ingreso'];

    protected $casts = [
        'responsable_plata' => 'boolean',
        'calendario_activo' => 'boolean',
        'acepta_sincronizacion' => 'boolean',
        'fecha_ingreso' => 'datetime',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }

    public function grupo()
    {
        return $this->belongsTo(Grupo::class, 'id_grupo', 'id_grupo');
    }
}
