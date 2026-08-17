<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

use App\Http\Controllers\App\DashboardController;

use App\Http\Controllers\Master\CategoryController;
use App\Http\Controllers\Master\BrandController;
use App\Http\Controllers\Master\UnitController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('home');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    Route::resource('categories', CategoryController::class)->except(['create', 'show', 'edit']);
    Route::put('categories/{id}/restore', [CategoryController::class, 'restore'])->name('categories.restore');
    Route::delete('categories/{id}/force-delete', [CategoryController::class, 'forceDelete'])->name('categories.force-delete');

    Route::resource('brands', BrandController::class)->except(['create', 'show', 'edit']);
    Route::put('brands/{id}/restore', [BrandController::class, 'restore'])->name('brands.restore');
    Route::delete('brands/{id}/force-delete', [BrandController::class, 'forceDelete'])->name('brands.force-delete');
    
    Route::resource('units', UnitController::class)->except(['create', 'show', 'edit']);
});

require __DIR__.'/settings.php';
