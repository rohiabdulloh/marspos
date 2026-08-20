<?php

namespace App\Http\Requests\Master;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $productId = $this->route('product')?->id;

        return [
            'category_id' => 'nullable|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'base_unit_id' => 'required|exists:units,id',
            'sku' => 'required|string|max:50|unique:products,sku,' . $productId,
            'barcode' => 'nullable|string|max:100|unique:products,barcode,' . $productId,
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:30',
            'description' => 'nullable|string',
            'purchase_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'minimum_stock' => 'required|numeric|min:0',
            'maximum_stock' => 'nullable|numeric|min:0',
            'has_batch' => 'boolean',
            'has_expiry' => 'boolean',
            'is_active' => 'boolean',

            // Validasi untuk Satuan Tambahan (Product Units)
            'units' => 'array',
            'units.*.unit_id' => 'required|exists:units,id',
            'units.*.conversion_factor' => 'required|numeric|min:0.001',
            'units.*.purchase_price' => 'nullable|numeric|min:0',
            'units.*.selling_price' => 'nullable|numeric|min:0',
            'units.*.is_purchase_unit' => 'boolean',
            'units.*.is_sale_unit' => 'boolean',

            // Validasi untuk Harga Tingkat/Varian (Product Prices)
            'prices' => 'array',
            'prices.*.unit_id' => 'nullable|exists:units,id',
            'prices.*.price_type' => 'required|string|max:30',
            'prices.*.price' => 'required|numeric|min:0',
            'prices.*.minimum_quantity' => 'required|numeric|min:0',
        ];
    }
}