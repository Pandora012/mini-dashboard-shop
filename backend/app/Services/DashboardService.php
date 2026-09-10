<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleDetail;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function summary()
    {
        return ['total_omzet' => (float) Sale::sum('total_amount'), 
        'total_transaksi' => Sale::count(), 
        'total_produk' => Product::count(),
        'total_stok' => (int) Product::sum('stock')];
    }

    public function revenue()
    {
        $monthExpression = match (DB::connection()->getDriverName()) {
            'sqlite' => "strftime('%Y-%m', created_at)",
            'pgsql' => "TO_CHAR(created_at, 'YYYY-MM')",
            default => "DATE_FORMAT(created_at, '%Y-%m')",
        };

        return Sale::selectRaw("{$monthExpression} as month, SUM(total_amount) as revenue")
            ->groupBy('month')
            ->orderBy('month')
            ->get();
    }

    public function topProducts()
    {
        return SaleDetail::join('products', 'products.id', '=', 'sale_details.product_id')
        ->select('products.id', 'products.name', DB::raw('SUM(sale_details.quantity) as quantity'), DB::raw('SUM(sale_details.subtotal) as revenue'))
        ->groupBy('products.id', 'products.name')
        ->orderByDesc('quantity')->limit(5)->get();
    }
}
