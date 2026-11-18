<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class ProfileController extends Controller
{
    private const AVATAR_FIELDS = ['avatar_color', 'avatar_style', 'blobatar_shape'];

    public function update(UpdateProfileRequest $request)
    {
        $user = $request->user();
        $validated = $request->validated();

        $avatar = Arr::only($validated, self::AVATAR_FIELDS);
        $profile = Arr::except($validated, self::AVATAR_FIELDS);

        DB::transaction(function () use ($user, $profile, $avatar) {
            $user->update($profile);

            if ($avatar !== []) {
                $user->avatarPreference()->updateOrCreate([], $avatar);
            }
        });

        return response()->json([
            'user' => $user->fresh(),
        ]);
    }
}
