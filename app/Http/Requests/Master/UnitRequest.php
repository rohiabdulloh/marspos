<?php

namespace App\Http\Requests\Master;

use Illuminate\Foundation\Http\FormRequest;

class UnitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $unitId = $this->route('unit')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'short_name' => ['required', 'string', 'max:50', 'unique:units,short_name,' . $unitId],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ];
    }
}