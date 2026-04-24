<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;


use App\Http\Controllers\Pages\AccountController;
use App\Http\Controllers\Pages\CustomerController;

Route::resource('accounts', AccountController::class);
Route::resource('customers', CustomerController::class);


Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
