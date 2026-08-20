<?php
namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;

class SettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Sesuaikan dengan policy/izin user jika diperlukan
    }

    public function rules(): array
    {
        return [
            // App (Global)
            'app_name' => 'nullable|string|max:255',
            'app_timezone' => 'nullable|string|max:100',
            
            // Payment (Global)
            'payment_qris_active' => 'nullable|boolean',
            'payment_midtrans_key' => 'nullable|string|max:255',
            
            // Tax (Global)
            'tax_percentage' => 'nullable|numeric|min:0|max:100',
            'tax_name' => 'nullable|string|max:50',
            
            // Printer (Per Toko)
            'printer_name' => 'nullable|string|max:255',
            'printer_connection_type' => 'nullable|string|in:usb,network,bluetooth',
            'printer_paper_size' => 'nullable|integer|in:58,80',
        ];
    }
}