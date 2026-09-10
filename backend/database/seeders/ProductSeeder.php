<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $items = [['Laptop Pro', 'Electronics', 12500000, 15], ['Wireless Mouse', 'Accessories', 250000, 40], ['Mechanical Keyboard', 'Accessories', 850000, 25], ['USB-C Hub', 'Accessories', 450000, 30], ['Monitor 24 inch', 'Electronics', 3200000, 12], ['Webcam HD', 'Electronics', 650000, 20], ['Headset', 'Accessories', 550000, 35], ['Office Chair', 'Furniture', 2100000, 10], ['Desk Lamp', 'Furniture', 300000, 18], ['Notebook', 'Stationery', 35000, 100]];
        foreach ($items as [$name,$category,$price,$stock]) {
            Product::updateOrCreate(['name' => $name], compact('name', 'category', 'price', 'stock'));
        }
    }
}
