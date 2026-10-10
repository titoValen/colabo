<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Acuerdo extends Model
{
    protected $table = 'acuerdos';
    protected $primaryKey = 'id_acuerdo';
    public $timestamps = false;

    protected $fillable = [
        'id_grupo',
        'id_creador',
        'id_responsable',
        'id_usuario_cumplir',
        'titulo',
        'descripcion',
        'fecha_limite',
        'estado',
        'fecha_creacion',
        'fecha_cumplimiento',
    ];

    protected $casts = [
        'fecha_limite' => 'date',
        'fecha_creacion' => 'datetime',
        'fecha_cumplimiento' => 'datetime',
    ];

    public function grupo()
    {
        return $this->belongsTo(Grupo::class, 'id_grupo', 'id_grupo');
    }

    public function creador()
    {
        return $this->belongsTo(Usuario::class, 'id_creador', 'id_usuario');
    }

    public function responsable()
    {
        return $this->belongsTo(Usuario::class, 'id_responsable', 'id_usuario');
    }

    public function usuarioCumplir()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario_cumplir', 'id_usuario');
    }

    public function respuestas()
    {
        return $this->hasMany(RespuestaAcuerdo::class, 'id_acuerdo', 'id_acuerdo');
    }

    public function recordatorios()
    {
        return $this->hasMany(Recordatorio::class, 'id_acuerdo', 'id_acuerdo');
    }
}
