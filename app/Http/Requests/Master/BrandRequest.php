<?php

namespace App\Http\Requests\Master;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BrandRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $brandId = $this->route('brand')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required', 
                'string', 
                'max:255', 
                Rule::unique('brands', 'slug')->ignore($brandId)
            ],
            'logo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ];
    }
}