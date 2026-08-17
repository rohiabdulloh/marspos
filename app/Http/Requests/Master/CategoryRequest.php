<?php

namespace App\Http\Requests\Master;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $categoryId = $this->route('category')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required', 
                'string', 
                'max:255', 
                Rule::unique('categories', 'slug')->ignore($categoryId)
            ],
            'description' => ['nullable', 'string'],
            'parent_id' => [
                'nullable', 
                'exists:categories,id', 
                Rule::notIn([$categoryId])
            ],
            'is_active' => ['boolean'],
        ];
    }
}