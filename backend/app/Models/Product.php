<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['name', 'price', 'category', 'stock'];

    protected $casts = ['price' => 'decimal:2', 'stock' => 'integer'];

    public function saleDetails()
    {
        return $this->hasMany(SaleDetail::class);
    }
}
