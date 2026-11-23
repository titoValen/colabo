<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\GroupController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\OnboardingController;
use App\Http\Controllers\Api\PresenceController;
use App\Http\Controllers\Api\PushSubscriptionController;
use App\Http\Controllers\Api\PasswordController;
use App\Http\Controllers\Api\ProfileController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
  Route::post('/logout', [AuthController::class, 'logout']);
  Route::delete('/account', [AuthController::class, 'destroyAccount']);
  Route::get('/me', [AuthController::class, 'me']);
  Route::patch('/profile', [ProfileController::class, 'update']);
  Route::put('/password', [PasswordController::class, 'update'])->middleware('throttle:5,1');
  Route::post('/onboarding', [OnboardingController::class, 'store']);

  Route::apiResource('events', EventController::class);

  Route::apiResource('groups', GroupController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
  Route::post('/groups/{group}/images', [GroupController::class, 'storeImages']);

  Route::post('/messages', [MessageController::class, 'store']);
  Route::get('/notifications', [NotificationController::class, 'index']);
  Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
  Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
  Route::post('/presence/heartbeat', [PresenceController::class, 'heartbeat']);

  Route::post('/push-subscriptions', [PushSubscriptionController::class, 'store']);
  Route::delete('/push-subscriptions', [PushSubscriptionController::class, 'destroy']);

  Route::get('/dashboard/summary', [DashboardController::class, 'summary']);
  Route::get('/dashboard/search', [DashboardController::class, 'search']);
});
