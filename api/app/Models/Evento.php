<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evento extends Model
{
    protected $table = 'eventos';
    protected $primaryKey = 'id_evento';
    public $timestamps = false;

    protected $fillable = ['titulo', 'descripcion', 'fecha_hora', 'id_grupo', 'id_creador'];

    protected $casts = [
        'fecha_hora' => 'datetime',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }

    public function grupo()
    {
        return $this->belongsTo(Grupo::class, 'id_grupo', 'id_grupo');
    }

    public function sincronizaciones()
    {
        return $this->hasMany(SincronizacionCalendario::class, 'id_evento', 'id_evento');
    }

    public function recordatorios()
    {
        return $this->hasMany(Recordatorio::class, 'id_evento', 'id_evento');
    }
}
