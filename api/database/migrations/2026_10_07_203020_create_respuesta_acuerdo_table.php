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
        Schema::create('respuesta_acuerdo', function (Blueprint $table) {
            $table->foreignId('id_acuerdo')->constrained('acuerdos', 'id_acuerdo')->cascadeOnDelete();
            $table->foreignId('id_usuario')->constrained('usuarios', 'id_usuario')->cascadeOnDelete();
            $table->string('decision')->nullable();
            $table->timestamp('fecha_respuesta')->nullable();
            $table->primary(['id_acuerdo', 'id_usuario']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('respuesta_acuerdo');
    }
};
