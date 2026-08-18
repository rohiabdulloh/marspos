<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

use App\Http\Controllers\App\DashboardController;

use App\Http\Controllers\Master\CategoryController;
use App\Http\Controllers\Master\BrandController;
use App\Http\Controllers\Master\UnitController;
use App\Http\Controllers\Master\CustomerTypeController;
use App\Http\Controllers\Master\CustomerController;
use App\Http\Controllers\Master\SupplierController;
use App\Http\Controllers\Master\WarehouseController;
use App\Http\Controllers\Master\StoreController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('home');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // ------------------- ROUTE MASTER --------------------------------
    Route::resource('categories', CategoryController::class)->except(['create', 'show', 'edit']);
    Route::put('categories/{id}/restore', [CategoryController::class, 'restore'])->name('categories.restore');
    Route::delete('categories/{id}/force-delete', [CategoryController::class, 'forceDelete'])->name('categories.force-delete');

    Route::resource('brands', BrandController::class)->except(['create', 'show', 'edit']);
    Route::put('brands/{id}/restore', [BrandController::class, 'restore'])->name('brands.restore');
    Route::delete('brands/{id}/force-delete', [BrandController::class, 'forceDelete'])->name('brands.force-delete');
    
    Route::resource('units', UnitController::class)->except(['create', 'show', 'edit']);
    Route::resource('customer-types', CustomerTypeController::class)->except(['create', 'show', 'edit']);

    Route::resource('customers', CustomerController::class)->except(['create', 'show', 'edit']);
    Route::put('customers/{id}/restore', [CustomerController::class, 'restore'])->name('customers.restore');
    Route::delete('customers/{id}/force-delete', [CustomerController::class, 'forceDelete'])->name('customers.force-delete');

    Route::resource('suppliers', SupplierController::class)->except(['create', 'show', 'edit']);
    Route::put('suppliers/{id}/restore', [SupplierController::class, 'restore'])->name('suppliers.restore');
    Route::delete('suppliers/{id}/force-delete', [SupplierController::class, 'forceDelete'])->name('suppliers.force-delete');

    Route::resource('warehouses', WarehouseController::class);
    Route::put('warehouses/{id}/restore', [WarehouseController::class, 'restore'])->name('warehouses.restore');
    Route::delete('warehouses/{id}/force-delete', [WarehouseController::class, 'forceDelete'])->name('warehouses.force-delete');

    Route::resource('stores', StoreController::class);
    Route::put('stores/{id}/restore', [StoreController::class, 'restore'])->name('stores.restore');
    Route::delete('stores/{id}/force-delete', [StoreController::class, 'forceDelete'])->name('stores.force-delete');
});

require __DIR__.'/settings.php';
