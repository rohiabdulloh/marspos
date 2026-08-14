<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;


use App\Http\Controllers\Pages\AccountController;
use App\Http\Controllers\Pages\CustomerController;
use App\Http\Controllers\Pages\SupplierController;

use App\Http\Controllers\Pages\TransactionController;
use App\Http\Controllers\Pages\InvoiceController;
use App\Http\Controllers\Pages\BillController;
use App\Http\Controllers\Pages\PaymentController;


Route::inertia('/home', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('/', 'dashboard')->name('dashboard');
    
    Route::resource('accounts', AccountController::class);
    Route::resource('customers', CustomerController::class);
    Route::resource('suppliers', SupplierController::class);
    
    Route::resource('transactions', TransactionController::class);
    Route::resource('invoices', InvoiceController::class);
    Route::resource('bills', BillController::class);
    Route::resource('payments', PaymentController::class);
});

require __DIR__.'/settings.php';
