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
        Schema::create('memberships', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained('users', 'id')->cascadeOnDelete();
            $table->foreignId('group_id')->constrained('groups', 'id')->cascadeOnDelete();
            $table->string('role')->default('member');
            $table->boolean('is_financially_responsible')->default(false);
            $table->boolean('calendar_enabled')->default(false);
            $table->boolean('sync_enabled')->default(false);
            $table->timestamp('joined_at')->useCurrent();
            $table->primary(['user_id', 'group_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('memberships');
    }
};
