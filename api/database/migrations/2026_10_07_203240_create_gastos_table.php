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
        Schema::create('gastos', function (Blueprint $table) {
            $table->id('id_gasto');
            $table->foreignId('id_grupo')->constrained('grupos', 'id_grupo')->cascadeOnDelete();
            $table->foreignId('id_cargador')->constrained('usuarios', 'id_usuario');
            $table->string('concepto');
            $table->decimal('monto_total', 10, 2);
            $table->date('fecha');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gastos');
    }
};
