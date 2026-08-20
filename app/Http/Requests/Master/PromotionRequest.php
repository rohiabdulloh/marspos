<?php
namespace App\Http\Requests\Master;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PromotionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $promotionId = $this->route('promotion')?->id;

        return [
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('promotions', 'code')->ignore($promotionId),
            ],
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:buy_x_get_y,percentage,fixed,minimum_purchase',
            'buy_quantity' => 'nullable|numeric',
            'get_quantity' => 'nullable|numeric',
            'discount_value' => 'nullable|numeric',
            'discount_type' => 'nullable|string|in:percentage,fixed',
            'minimum_purchase' => 'nullable|numeric',
            'max_discount_amount' => 'nullable|numeric',
            'start_at' => 'nullable|date',
            'end_at' => 'nullable|date|after_or_equal:start_at',
            'priority' => 'nullable|integer',
            'usage_limit' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
            'description' => 'nullable|string',
            'products' => 'nullable|array',
            'products.*' => 'exists:products,id',
        ];
    }
}