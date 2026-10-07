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
        Schema::create('pagos', function (Blueprint $table) {
            $table->id('id_pago');
            $table->foreignId('id_parte')->constrained('parte_gasto', 'id_parte')->cascadeOnDelete();
            $table->foreignId('id_responsable')->constrained('usuarios', 'id_usuario');
            $table->string('metodo')->nullable();
            $table->string('estado')->default('pendiente');
            $table->timestamp('fecha_informado')->nullable();
            $table->timestamp('fecha_resolucion')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pagos');
    }
};
