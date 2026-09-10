<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class SaleService
{
    public function create(array $items, User $user): Sale
    {
        return DB::transaction(function () use ($items, $user) {
            $total = 0;
            $rows = [];
            foreach ($items as $item) {
                $p = Product::lockForUpdate()->findOrFail($item['product_id']);
                $qty = (int) $item['quantity'];
                if ($p->stock < $qty) {
                    throw new \DomainException("Insufficient stock for {$p->name}");
                }$sub = $p->price * $qty;
                $total += $sub;
                $rows[] = ['product' => $p, 'quantity' => $qty, 'price' => $p->price, 'subtotal' => $sub];
            }$sale = Sale::create(['user_id' => $user->id, 'total_amount' => $total]);
            foreach ($rows as $row) {
                $sale->details()->create(['product_id' => $row['product']->id, 'quantity' => $row['quantity'], 'price' => $row['price'], 'subtotal' => $row['subtotal']]);
                $row['product']->decrement('stock', $row['quantity']);
            }app(ActivityLogService::class)->record($user, "User {$user->name} created sale #{$sale->id}");

            return $sale->load('details.product');
        });
    }
}
