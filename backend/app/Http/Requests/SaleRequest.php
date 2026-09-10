<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SaleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return in_array($this->user('api')?->role?->name, ['admin', 'staff'], true);
    }

    public function rules(): array
    {
        return ['items' => 'required|array|min:1', 'items.*.product_id' => 'required|integer|exists:products,id', 'items.*.quantity' => 'required|integer|min:1'];
    }
}
