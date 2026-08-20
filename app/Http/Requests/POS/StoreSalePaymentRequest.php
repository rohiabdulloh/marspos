<?php

namespace App\Http\Requests\POS;

use Illuminate\Foundation\Http\FormRequest;

class StoreSalePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'amount' => [
                'required',
                'numeric',
                'gt:0',
            ],

            'payment_method' => [
                'required',
                'in:cash,transfer,debit_card,credit_card,qris,other',
            ],

            'cash_account_id' => [
                'required',
                'integer',
                'exists:cash_accounts,id',
            ],

            'reference_number' => [
                'nullable',
                'string',
                'max:100',
            ],

            'paid_at' => [
                'nullable',
                'date',
            ],

            'notes' => [
                'nullable',
                'string',
            ],
        ];
    }
}