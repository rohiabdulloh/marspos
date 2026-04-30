<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;


use App\Http\Controllers\Pages\AccountController;
use App\Http\Controllers\Pages\CustomerController;
use App\Http\Controllers\Pages\SupplierController;
use App\Http\Controllers\Pages\TransactionController;


Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    
    Route::resource('accounts', AccountController::class);
    Route::resource('customers', CustomerController::class);
    Route::resource('suppliers', SupplierController::class);
    
    Route::resource('transactions', TransactionController::class);
});

require __DIR__.'/settings.php';
