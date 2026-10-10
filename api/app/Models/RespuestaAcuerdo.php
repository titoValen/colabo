<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class RespuestaAcuerdo extends Pivot
{
    protected $table = "respuesta_acuerdo";
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = ['id_acuerdo', 'id_usuario', 'decision', 'fecha_respuesta'];

    protected $casts = [
        'decision' => 'string', // Dudando si poner en boolean
        'fecha_respuesta' => 'datetime'
    ];

    public function acuerdo()
    {
        return $this->belongsTo(Acuerdo::class, 'id_acuerdo', 'id_acuerdo');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }
}
