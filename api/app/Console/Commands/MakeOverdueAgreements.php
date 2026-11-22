<?php

namespace App\Console\Commands;

use App\Enums\AgreementStatus;
use App\Models\Agreement;
use Carbon\CarbonImmutable;
use Illuminate\Console\Command;

class MakeOverdueAgreements extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'agreements:mark-overdue';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Marca como Incomplete los acuerdos Pending cuyo vencimiento ya pasó.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = CarbonImmutable::now('America/Argentina/Buenos_Aires')->toDateString();

        $updated = Agreement::query()
            ->where('status', AgreementStatus::Pending->value)
            ->whereNotNull('due_date')
            ->where('due_date', '<', $today)
            ->update(['status'=> AgreementStatus::Incomplete->value]);

        $this->info("Acuerdos marcados como Incomplete: {$updated}");

        return self::SUCCESS;
    }
}
