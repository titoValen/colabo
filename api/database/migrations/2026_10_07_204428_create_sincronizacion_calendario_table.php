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
        Schema::create('sincronizacion_calendario', function (Blueprint $table) {
            $table->foreignId('id_evento')->constrained('eventos', 'id_evento')->cascadeOnDelete();
            $table->foreignId('id_usuario')->constrained('usuarios', 'id_usuario')->cascadeOnDelete();
            $table->string('estado')->default('pendiente');
            $table->timestamp('fecha_sincronizacion')->nullable();
            $table->primary(['id_evento', 'id_usuario']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sincronizacion_calendario');
    }
};
