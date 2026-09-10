# Sales Manager

Laravel REST API + React/Vite frontend for product management and sales transactions.

## Local setup

1. In `backend`, configure `.env` (`DB_*`) and run `php artisan jwt:secret` (or set `JWT_SECRET`). The foreign key on users is `roles_id`, matching the supplied database design.
2. Run `php artisan migrate --seed`.
3. Run `php artisan serve`.
4. In `frontend`, run `npm install` and `npm run dev`. Set `VITE_API_URL` when the API is not `http://localhost:8000/api`.

Demo accounts: `admin@example.com` / `password`, and `staff@example.com` / `password`.

## Docker

Run `docker compose up --build`; frontend is on port 5173 and API on port 8000. The backend uses `DB_HOST=mysql` inside the Compose network.

## API

`POST /api/login`, `POST /api/logout`, product CRUD at `/api/products`, `POST /api/sales`, admin-only `/api/activity-logs`, and dashboard endpoints `/api/dashboard/summary`, `/api/dashboard/revenue`, `/api/dashboard/top-products`.

JWT is sent as `Authorization: Bearer <token>`. Admin-only routes are enforced by backend `role:admin` middleware. Sales use a database transaction and `lockForUpdate()`; prices are snapshotted in `sale_details`.

## Postman smoke test

1. `POST /api/login` with `{"email":"admin@example.com","password":"password"}` and save `token`.
2. Add `Authorization: Bearer <token>` to a request for `GET /api/products` or the admin dashboard.
3. Create a sale with `POST /api/sales` and body `{"items":[{"product_id":1,"quantity":1}]}`.
4. `POST /api/logout` with the same bearer token.

Staff can view products and create sales, but receives `403` for product mutations, dashboard, and activity logs.
