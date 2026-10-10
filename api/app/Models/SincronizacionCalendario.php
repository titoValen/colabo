<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class SincronizacionCalendario extends Pivot
{
    protected $table = "sincronizacion_calendario";
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = ['id_evento', 'id_usuario', 'estado', 'fecha_sincronizacion'];

    protected $casts = [
        'estado' => 'boolean', // Dudando
        'fecha_sincronizacion' => 'datetime'
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }

    public function evento ()
    {
        return $this->belongsTo(Evento::class, 'id_evento', 'id_evento');
    }
}
