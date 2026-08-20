<?php
namespace App\Http\Controllers\Settings;

use App\Http\Requests\Settings\SettingRequest;
use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function app(Request $request)
    {
        $settings = Setting::whereNull('store_id')
            ->where('key', 'like', 'app_%')
            ->get()
            ->pluck('typed_value', 'key');

        return Inertia::render('settings/app', ['settings' => $settings]);
    }

    public function payment(Request $request)
    {
        $settings = Setting::whereNull('store_id')
            ->where('key', 'like', 'payment_%')
            ->get()
            ->pluck('typed_value', 'key');

        return Inertia::render('settings/payment', ['settings' => $settings]);
    }

    public function tax(Request $request)
    {
        $settings = Setting::whereNull('store_id')
            ->where('key', 'like', 'tax_%')
            ->get()
            ->pluck('typed_value', 'key');

        return Inertia::render('settings/tax', ['settings' => $settings]);
    }

    public function printer(Request $request)
    {
        // Ambil daftar semua toko untuk pilihan dropdown
        $stores = Store::select('id', 'name')->get();

        // Tentukan store_id yang sedang aktif (bisa dari query parameter ?store_id=X atau user login)
        $storeId = $request->input('store_id') ?? $stores->first()->id ?? null;

        // Ambil setting printer berdasarkan store_id tersebut
        $settings = Setting::where('store_id', $storeId)
            ->where('key', 'like', 'printer_%')
            ->get()
            ->pluck('typed_value', 'key');

        return Inertia::render('settings/printer', [
            'stores' => $stores,
            'selectedStoreId' => $storeId,
            'settings' => $settings,
        ]);
    }

    public function updatePrinter(SettingRequest $request)
    {
        // Validasi tambahan untuk memastikan store_id disertakan
        $request->validate([
            'store_id' => 'required|exists:stores,id',
        ]);

        $storeId = $request->input('store_id');

        // Loop data yang tervalidasi (kecuali store_id itu sendiri)
        foreach ($request->except(['store_id']) as $key => $value) {
            $type = 'string';
            if (is_int($value)) {
                $type = 'integer';
            } elseif (is_numeric($value) && !is_int($value)) {
                $type = 'decimal';
            } elseif (is_bool($value) || $value === 'true' || $value === 'false') {
                $type = 'boolean';
                $value = filter_var($value, FILTER_VALIDATE_BOOLEAN);
            }

            Setting::updateOrCreate(
                [
                    'key' => $key,
                    'store_id' => $storeId, // Simpan spesifik berdasarkan toko terpilih
                ],
                [
                    'value' => $value,
                    'type' => $type,
                    'description' => 'Konfigurasi printer untuk toko ID: ' . $storeId,
                ]
            );
        }

        return back()->with('success', 'Pengaturan printer berhasil diperbarui.');
    }

    public function update(SettingRequest $request)
    {
        $storeId = $request->user()->store_id ?? null;

        foreach ($request->validated() as $key => $value) {
            $isStoreSpecific = str_starts_with($key, 'printer_');
            $targetStoreId = $isStoreSpecific ? $storeId : null;

            $type = 'string';
            if (is_int($value)) {
                $type = 'integer';
            } elseif (is_numeric($value) && !is_int($value)) {
                $type = 'decimal';
            } elseif (is_bool($value) || $value === 'true' || $value === 'false') {
                $type = 'boolean';
                $value = filter_var($value, FILTER_VALIDATE_BOOLEAN);
            }

            Setting::updateOrCreate(
                ['key' => $key, 'store_id' => $targetStoreId],
                ['value' => $value, 'type' => $type, 'description' => 'Konfigurasi ' . $key]
            );
        }

        return back()->with('success', 'Pengaturan berhasil diperbarui.');
    }
}