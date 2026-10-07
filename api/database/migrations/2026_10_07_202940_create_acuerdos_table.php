<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('acuerdos', function (Blueprint $table) {
            $table->id('id_acuerdo');
            $table->foreignId('id_grupo')->constrained('grupos', 'id_grupo')->cascadeOnDelete();
            $table->foreignId('id_creador')->constrained('usuarios', 'id_usuario');
            $table->foreignId('id_responsable')->constrained('usuarios', 'id_usuario');
            $table->foreignId('id_usuario_cumplir')->constrained('usuarios', 'id_usuario');
            $table->string('titulo');
            $table->text('descripcion')->nullable();
            $table->date('fecha_limite')->nullable();
            $table->string('estado')->default('pendiente');
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->timestamp('fecha_cumplimiento')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('acuerdos');
    }
};
