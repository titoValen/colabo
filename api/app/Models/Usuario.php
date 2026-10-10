<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'usuarios';

    protected $primaryKey = 'id_usuario';

    protected $fillable = ['nombre', 'email', 'password', 'notificaciones'];

    protected $hidden = ['password'];

    protected $casts = [
        'password' => 'hashed',
        'notificaciones' => 'boolean',
    ];

    public function grupos()
    {
        return $this->belongsToMany(Grupo::class, 'membresias', 'id_usuario', 'id_grupo')
            ->using(Membresia::class)
            ->withPivot('rol', 'responsable_plata', 'calendario_activo', 'acepta_sincronizacion', 'fecha_ingreso');
    }

    public function eventosCreados()
    {
        return $this->hasMany(Evento::class, 'id_creador', 'id_usuario');
    }

    public function acuerdosCreados()
    {
        return $this->hasMany(Acuerdo::class, 'id_creador', 'id_usuario');
    }

    public function mensajes()
    {
        return $this->hasMany(Mensaje::class, 'id_usuario', 'id_usuario');
    }

    public function recordatorios()
    {
        return $this->hasMany(Recordatorio::class, 'id_usuario', 'id_usuario');
    }

    public function datosCobro()
    {
        return $this->hasMany(DatosCobro::class, 'id_usuario', 'id_usuario');
    }

    public function gastosCargados()
    {
        return $this->hasMany(Gasto::class, 'id_cargador', 'id_usuario');
    }

    public function partesGasto()
    {
        return $this->hasMany(ParteGasto::class, 'id_usuario', 'id_usuario');
    }

    public function pagos()
    {
        return $this->hasMany(Pago::class, 'id_responsable', 'id_usuario');
    }

    public function sincronizaciones()
    {
        return $this->hasMany(SincronizacionCalendario::class, 'id_usuario', 'id_usuario');
    }

    public function respuestasAcuerdo()
    {
        return $this->hasMany(RespuestaAcuerdo::class, 'id_usuario', 'id_usuario');
    }
}
