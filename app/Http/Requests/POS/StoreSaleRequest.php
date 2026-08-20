<?php

namespace App\Http\Requests\POS;

use Illuminate\Foundation\Http\FormRequest;

class StoreSaleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [

            'store_id' => [
                'required',
                'integer',
                'exists:stores,id',
            ],

            'warehouse_id' => [
                'required',
                'integer',
                'exists:warehouses,id',
            ],

            'customer_id' => [
                'nullable',
                'integer',
                'exists:customers,id',
            ],

            'sale_type' => [
                'required',
                'in:cash,credit',
            ],

            'transaction_date' => [
                'nullable',
                'date',
            ],

            'shipping_cost' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'rounding_amount' => [
                'nullable',
                'numeric',
            ],

            'paid_amount' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'items' => [
                'required',
                'array',
                'min:1',
            ],

            'items.*.product_id' => [
                'required',
                'integer',
                'exists:products,id',
            ],

            'items.*.unit_id' => [
                'required',
                'integer',
                'exists:units,id',
            ],

            'items.*.quantity' => [
                'required',
                'numeric',
                'gt:0',
            ],

            'items.*.batch_id' => [
                'nullable',
                'integer',
                'exists:product_batches,id',
            ],

            'items.*.unit_price' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'items.*.discount_amount' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'items.*.discount_percentage' => [
                'nullable',
                'numeric',
                'min:0',
                'max:100',
            ],

            'items.*.tax_percentage' => [
                'nullable',
                'numeric',
                'min:0',
                'max:100',
            ],

            'items.*.notes' => [
                'nullable',
                'string',
            ],
        ];
    }
}