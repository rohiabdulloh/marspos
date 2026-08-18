<?php
namespace App\Http\Requests\Master;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $customerId = $this->route('customer')?->id;

        return [
            'code' => [
                'required',
                'string',
                'max:30',
                Rule::unique('customers', 'code')->ignore($customerId),
            ],
            'name' => 'required|string|max:255',
            'customer_type_id' => 'required|exists:customer_types,id',
            'phone' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:10',
            'credit_limit' => 'nullable|numeric|min:0',
            'credit_term_days' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
            'is_active' => 'boolean',
        ];
    }
}