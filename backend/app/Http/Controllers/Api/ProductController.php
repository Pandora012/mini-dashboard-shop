<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(private ProductService $service) {}

    public function index(Request $r)
    {
        $q = Product::query();
        if ($r->filled('search')) {
            $q->where('name', 'like', '%'.$r->search.'%');
        }

        return response()->json(['success' => true, 'data' => $q->latest()->paginate(15)]);
    }

    public function store(ProductRequest $r)
    {
        return response()->json(['success' => true, 'message' => 'Product created', 'data' => $this->service->create($r->validated(), $r->user('api'))], 201);
    }

    public function update(ProductRequest $r, Product $product)
    {
        return response()->json([
            'success' => true,
            'message' => 'Product updated',
            'data' => $this->service->update($product, $r->validated(), $r->user('api')),
        ]);
    }

    public function destroy(Request $r, Product $product)
    {
        try {
            $this->service->delete($product, $r->user('api'));

            return response()->json(['success' => true, 'message' => 'Product deleted']);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => 'Product cannot be deleted because it has sales'], 409);
        }
    }
}
