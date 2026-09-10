<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;

class ActivityLogController extends Controller
{
    public function index()
    {
        return response()->json(['success' => true, 'data' => ActivityLog::with('user:id,name')->latest('created_at')->paginate(20)]);
    }
}
