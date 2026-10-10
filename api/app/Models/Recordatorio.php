<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recordatorio extends Model
{
    protected $table = 'recordatorios';

    protected $primaryKey = 'id_recordatorio';

    public $timestamps = false;

    protected $fillable = ['id_usuario', 'id_evento', 'id_pago', 'id_acuerdo', 'tipo', 'mensaje', 'canal', 'fecha_envio'];

    protected $casts = ['fecha_envio' => 'datetime'];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }

    public function evento()
    {
        return $this->belongsTo(Evento::class, 'id_evento', 'id_evento');
    }

    public function acuerdo()
    {
        return $this->belongsTo(Acuerdo::class, 'id_acuerdo', 'id_acuerdo');
    }

    public function pago()
    {
        return $this->belongsTo(Pago::class, 'id_pago', 'id_pago');
    }
}
