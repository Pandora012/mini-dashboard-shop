<?php

namespace App\Services;

use App\Models\Product;
use App\Models\User;

class ProductService
{
    public function create(array $data, User $user)
    {
        $p = Product::create($data);
        app(ActivityLogService::class)->record($user, "User {$user->name} created product #{$p->id}");

        return $p;
    }

    public function update(Product $p, array $data, User $user)
    {
        $old = $p->price;
        $p->update($data);
        $log = "User {$user->name} updated product #{$p->id}";
        if (array_key_exists('price', $data) && (float) $old !== (float) $p->price) {
            $log = "User {$user->name} changed price product #{$p->id} from {$old} to {$p->price}";
        }app(ActivityLogService::class)->record($user, $log);

        return $p;
    }

    public function delete(Product $p, User $user): void
    {
        $id = $p->id;
        $p->delete();
        app(ActivityLogService::class)->record($user, "User {$user->name} deleted product #{$id}");
    }
}
