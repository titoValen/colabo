<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mensaje extends Model
{
    protected $table = "mensaje";
    protected $primaryKey = 'id_mensaje';
    public $timestamps = false;

    protected $fillable = ['id_grupo', 'id_usuario', 'contenido', 'fecha_envio'];

    protected $casts = ['fecha_envio' => 'datetime'];

    public function grupo()
    {
        return $this->belongsTo(Grupo::class, 'id_grupo', 'id_grupo');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }
}
