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
}
