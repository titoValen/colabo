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
        Schema::table('groups', function (Blueprint $table) {
            $table->string('color', 7)->default('#cb4528');
            $table->string('avatar_preset', 20)->nullable();
            $table->string('avatar_path')->nullable();
            $table->string('cover_path')->nullable();
            $table->text('purpose')->nullable();
            $table->unsignedSmallInteger('member_limit')->default(10);
            $table->boolean('members_can_invite')->default(false);
            $table->boolean('members_can_create_tasks')->default(true);
            $table->boolean('members_can_add_expenses')->default(true);
            $table->boolean('expenses_enabled')->default(false);
            $table->string('currency', 3)->nullable();
            $table->decimal('budget', 12, 2)->nullable();
            $table->string('expense_split', 20)->nullable();
            $table->decimal('contribution_amount', 12, 2)->nullable();
        });

        Schema::table('rules', function (Blueprint $table) {
            $table->string('type', 20)->default('rule');
            $table->boolean('requires_acceptance')->default(false);
        });

        Schema::table('invitations', function (Blueprint $table) {
            $table->string('invitee')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->dropColumn('invitee');
        });

        Schema::table('rules', function (Blueprint $table) {
            $table->dropColumn(['type', 'requires_acceptance']);
        });

        Schema::table('groups', function (Blueprint $table) {
            $table->dropColumn([
                'color',
                'avatar_preset',
                'avatar_path',
                'cover_path',
                'purpose',
                'member_limit',
                'members_can_invite',
                'members_can_create_tasks',
                'members_can_add_expenses',
                'expenses_enabled',
                'currency',
                'budget',
                'expense_split',
                'contribution_amount',
            ]);
        });
    }
};
