<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        foreach ([['Admin', 'admin@example.com', 'admin'], ['Staff', 'staff@example.com', 'staff']] as [$name,$email,$role]) {
            User::updateOrCreate(['email' => $email], ['name' => $name, 'password' => Hash::make('password'), 'roles_id' => Role::where('name', $role)->value('id')]);
        }
    }
}
