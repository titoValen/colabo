<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
    protected $table = 'pagos';

    protected $primaryKey = 'id_pago';

    public $timestamps = false;

    protected $fillable = ['id_parte', 'id_responsable', 'metodo', 'estado', 'fecha_informado', 'fecha_resolucion'];

    protected $casts = [
        'estado' => 'string',
        'fecha_informado' => 'datetime',
        'fecha_resolucion' => 'datetime',
    ];

    public function parte()
    {
        return $this->belongsTo(ParteGasto::class, 'id_parte', 'id_parte');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_responsable', 'id_usuario');
    }
}
