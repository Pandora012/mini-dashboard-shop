<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ActivityLogService;
use App\Services\AuthService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(private AuthService $auth, private ActivityLogService $logs) {}

    public function login(Request $request)
    {
        $data = $request->validate(['email' => 'required|email', 'password' => 'required|string']);
        try {
            $result = $this->auth->login($data);
            $this->logs->record($result['user'], 'User '.$result['user']->name.' logged in');

            return response()->json(['success' => true, 'message' => 'Login successful', 'token' => $result['token'], 'user' => ['id' => $result['user']->id, 'name' => $result['user']->name, 'email' => $result['user']->email, 'role' => $result['user']->role->name]]);
        } catch (\RuntimeException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 401);
        }
    }

    public function logout()
    {
        $this->auth->logout();

        return response()->json(['success' => true, 'message' => 'Logout successful']);
    }
}
