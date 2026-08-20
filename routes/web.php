<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

use App\Http\Controllers\App\DashboardController;

use App\Http\Controllers\Master\ProductController;
use App\Http\Controllers\Master\CategoryController;
use App\Http\Controllers\Master\BrandController;
use App\Http\Controllers\Master\UnitController;
use App\Http\Controllers\Master\CustomerTypeController;
use App\Http\Controllers\Master\CustomerController;
use App\Http\Controllers\Master\SupplierController;
use App\Http\Controllers\Master\WarehouseController;
use App\Http\Controllers\Master\StoreController;
use App\Http\Controllers\Master\PromotionController;

use App\Http\Controllers\Settings\UserController;
use App\Http\Controllers\Settings\RoleController;
use App\Http\Controllers\Settings\SettingController;
use App\Http\Controllers\Settings\AuditLogController;


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('home');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // ------------------- ROUTE MASTER --------------------------------

    Route::resource('products', ProductController::class);
    Route::put('/products/{id}/restore', [ProductController::class, 'restore'])->name('products.restore');
    Route::delete('/products/{id}/force-delete', [ProductController::class, 'forceDelete'])->name('products.force-delete');
    Route::post( '/products/bulk-destroy', [ProductController::class, 'bulkDestroy'] )->name('products.bulk-destroy');

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

    Route::resource('promotions', PromotionController::class);
    Route::put('promotions/{id}/restore', [PromotionController::class, 'restore'])->name('promotions.restore');
    Route::delete('promotions/{id}/force-delete', [PromotionController::class, 'forceDelete'])->name('promotions.force-delete');
    
    // ------------------- ROUTE SETTING --------------------------------
    Route::resource('settings/users', UserController::class)->except(['create', 'show', 'edit']);
    Route::resource('settings/roles', RoleController::class)->except(['create', 'show', 'edit']);
    Route::post('roles/{role}/permissions', [RoleController::class, 'updatePermissions'])->name('roles.permissions.update');
    Route::get('settings/app', [SettingController::class, 'app'])->name('settings.app');
    Route::get('settings/payment', [SettingController::class, 'payment'])->name('settings.payment');
    Route::get('settings/tax', [SettingController::class, 'tax'])->name('settings.tax');
    Route::post('setting/', [SettingController::class, 'update'])->name('settings.update');
    Route::get('settings/printer', [SettingController::class, 'printer'])->name('settings.printer');
    Route::post('settings/printer', [SettingController::class, 'updatePrinter'])->name('printer.update');

    Route::get('settings/audit-log', [AuditLogController::class, 'index'])->name('audit-log.index');
    Route::delete('settings/audit-log/{audit_log}', [AuditLogController::class, 'destroy'])->name('audit-log.destroy');
});

require __DIR__.'/settings.php';
