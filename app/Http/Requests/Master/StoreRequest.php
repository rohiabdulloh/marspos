<?php
namespace App\Http\Requests\Master;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $storeId = $this->route('store')?->id;

        return [
            'code' => [
                'required',
                'string',
                'max:20',
                Rule::unique('stores', 'code')->ignore($storeId),
            ],
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:10',
            'logo' => 'nullable|string|max:255', // Sesuaikan jika menggunakan file upload
            'is_active' => 'boolean',
        ];
    }
}