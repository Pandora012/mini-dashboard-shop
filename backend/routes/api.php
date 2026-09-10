<?php

use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SaleController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/sales', [SaleController::class, 'store'])->middleware('role:admin,staff');
    Route::middleware('role:admin')->group(function () {
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);
        Route::get('/dashboard/summary', [DashboardController::class, 'summary']);
        Route::get('/dashboard/revenue', [DashboardController::class, 'revenue']);
        Route::get('/dashboard/top-products', [DashboardController::class, 'topProducts']);
        Route::get('/activity-logs', [ActivityLogController::class, 'index']);
    });
});
