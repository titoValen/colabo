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

    public function acuerdos()
    {
        return $this->hasMany(Acuerdo::class, 'id_grupo', 'id_grupo');
    }

    public function gastos()
    {
        return $this->hasMany(Gasto::class, 'id_grupo', 'id_grupo');
    }

    public function reglas()
    {
        return $this->hasMany(Regla::class, 'id_grupo', 'id_grupo');
    }

    public function metas()
    {
        return $this->hasMany(Meta::class, 'id_grupo', 'id_grupo');
    }

    public function mensajes()
    {
        return $this->hasMany(Mensaje::class, 'id_grupo', 'id_grupo');
    }

    public function invitaciones()
    {
        return $this->hasMany(Invitacion::class, 'id_grupo', 'id_grupo');
    }

    public function datosCobro()
    {
        return $this->hasMany(DatosCobro::class, 'id_grupo', 'id_grupo');
    }
}
