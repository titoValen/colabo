<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PresenceController extends Controller
{
    public function heartbeat(Request $request)
    {
        $now = now();

        DB::table('user_presences')->upsert(
            [[
                'user_id' => $request->user()->id,
                'last_seen_at' => $now,
                'created_at' => $now,
                'updated_at' => $now,
            ]],
            ['user_id'],
            ['last_seen_at', 'updated_at'],
        );

        return response()->noContent();
    }
}
