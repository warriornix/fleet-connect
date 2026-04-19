# VLIP Backend (Express + Prisma) — Reference Code

This `backend/` folder, the root `Dockerfile`, and `docker-compose.yml` are
**reference implementations** that DO NOT run inside the Lovable preview
(which uses TanStack Start on Cloudflare Workers + Lovable Cloud Postgres).

The live frontend in `src/` is fully functional and uses Lovable Cloud
directly — see those files. This folder is for running an Express/Prisma
backend on your own infrastructure.

## Run locally with Docker

```bash
docker-compose up --build
```

This starts:
- Postgres on `:5432`
- Express API on `:5000`
- Auto-runs migrations and seeds 3 demo users + 5 vehicles

Then point a frontend at `http://localhost:5000` and login with:
- admin@vlip.com / admin123
- manager@vlip.com / manager123
- driver@vlip.com / driver123

## Endpoints

- `POST /api/auth/register|login`, `GET /api/auth/me`
- `GET|POST|PUT|DELETE /api/vehicles[/:id]`
- `GET /api/fleet/research/search?q=`
- `GET|POST /api/fleet/fuel/logs`
- `GET|POST /api/fleet/maintenance`
- `GET /api/fleet/schedules/upcoming`, `POST /api/fleet/schedules`
- `GET /api/fleet/recalls/search?vin=`
- `GET /api/fleet/reports/fleet?format=pdf|csv|excel`
- `GET /api/fleet/analytics`
- `GET|POST /api/certificates`, `POST /api/certificates/:id/verify`
- `GET /api/fleet/users` (admin only)
