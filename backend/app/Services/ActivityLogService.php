<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;

class ActivityLogService
{
    public function record(?User $user, string $description): ActivityLog
    {
        return ActivityLog::create(['user_id' => $user?->id, 'action_description' => $description]);
    }
}
