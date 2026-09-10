<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user('api')?->role?->name === 'admin';
    }

    public function rules(): array
    {
        $required = $this->isMethod('post') ? 'required' : 'sometimes';

        return [
            'name' => [$required, 'string', 'max:255'],
            'price' => [$required, 'numeric', 'min:0'],
            'category' => [$required, 'string', 'max:255'],
            'stock' => [$required, 'integer', 'min:0'],
        ];
    }
}
