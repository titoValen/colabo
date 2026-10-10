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
        Schema::create('recordatorios', function (Blueprint $table) {
            $table->id('id_recordatorio');
            $table->foreignId('id_usuario')->constrained('usuarios', 'id_usuario')->cascadeOnDelete();
            $table->foreignId('id_evento')->nullable()->constrained('eventos', 'id_evento')->nullOnDelete();
            $table->foreignId('id_pago')->nullable()->constrained('pagos', 'id_pago')->nullOnDelete();
            $table->foreignId('id_acuerdo')->nullable()->constrained('acuerdos', 'id_acuerdo')->nullOnDelete();
            $table->string('tipo');
            $table->text('mensaje')->nullable();
            $table->string('canal')->nullable();
            $table->timestamp('fecha_envio')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recordatorios');
    }
};
