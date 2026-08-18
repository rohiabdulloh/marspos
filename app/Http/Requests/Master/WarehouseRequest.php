<?php
namespace App\Http\Requests\Master;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class WarehouseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $warehouseId = $this->route('warehouse')?->id;
        $storeId = $this->input('store_id');

        return [
            'store_id' => 'required|exists:stores,id',
            'code' => [
                'required',
                'string',
                'max:20',
                // Unik kombinasi store_id dan code, abaikan untuk data yang sedang diedit
                Rule::unique('warehouses', 'code')
                    ->where('store_id', $storeId)
                    ->ignore($warehouseId),
            ],
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:30',
            'address' => 'nullable|string',
            'is_main' => 'boolean',
            'is_active' => 'boolean',
        ];
    }
}