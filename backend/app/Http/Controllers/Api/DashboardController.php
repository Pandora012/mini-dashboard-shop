<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;

class DashboardController extends Controller
{
    public function __construct(private DashboardService $service) {}

    public function summary()
    {
        return response()->json(['success' => true, 'data' => $this->service->summary()]);
    }

    public function revenue()
    {
        return response()->json(['success' => true, 'data' => $this->service->revenue()]);
    }

    public function topProducts()
    {
        return response()->json(['success' => true, 'data' => $this->service->topProducts()]);
    }
}
