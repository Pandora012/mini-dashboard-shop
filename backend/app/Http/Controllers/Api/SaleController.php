<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SaleRequest;
use App\Services\SaleService;

class SaleController extends Controller
{
    public function __construct(private SaleService $service) {}

    public function store(SaleRequest $r)
    {
        try {
            return response()->json(['success' => true, 'message' => 'Sale created', 'data' => $this->service->create($r->validated()['items'], $r->user('api'))], 201);
        } catch (\DomainException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }
}
