<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grupo extends Model
{
    protected $table = 'grupos';
    protected $primaryKey = 'id_grupo';
    public $timestamps = false;

    protected $fillable = ['nombre', 'tipo', 'descripcion'];

    public function usuarios()
    {
        return $this->belongsToMany(Usuario::class, 'membresias', 'id_grupo', 'id_usuario')
            ->using(Membresia::class)
            ->withPivot('rol', 'responsable_plata', 'calendario_activo', 'acepta_sincronizacion', 'fecha_ingreso');
    }

    public function eventos()
    {
        return $this->hasMany(Evento::class, 'id_grupo', 'id_grupo');
    }
}
