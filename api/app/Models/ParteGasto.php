<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParteGasto extends Model
{
    protected $table = 'parte_gasto';

    protected $primaryKey = 'id_parte';

    public $timestamps = false;

    protected $fillable = ['id_gasto', 'id_usuario', 'monto', 'estado'];

    public function gasto()
    {
        return $this->belongsTo(Gasto::class, 'id_gasto', 'id_gasto');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }

    public function pagos()
    {
        return $this->hasMany(Pago::class, 'id_parte', 'id_parte');
    }
}
