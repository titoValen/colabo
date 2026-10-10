<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invitacion extends Model
{
    protected $table = 'invitaciones';

    protected $primaryKey = 'id_invitacion';

    public $timestamps = false;

    protected $fillable = ['id_grupo', 'codigo', 'fecha_vencimiento'];

    protected $casts = ['fecha_vencimiento' => 'datetime'];

    public function grupo()
    {
        return $this->belongsTo(Grupo::class, 'id_grupo', 'id_grupo');
    }
}
