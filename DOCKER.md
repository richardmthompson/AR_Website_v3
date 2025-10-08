# Docker Setup for AR Automation Website

This guide explains how to run the AR Automation website using Docker and Docker Compose.

## Architecture

The application is dockerized with the following services:

1. **Frontend** - React app served by Nginx (Port 80)
2. **Backend** - Python FastAPI application (Port 8000)
3. **Database** - PostgreSQL 15 (Port 5432) - Optional, can use external Neon DB

### What Changed?

The Express/Node.js server has been **eliminated** in the Docker setup:
- ✅ Frontend (Nginx) proxies API requests directly to FastAPI
- ✅ Simplified architecture with only 2 main services
- ✅ Better performance and reduced overhead
- ✅ Easier to scale and maintain

## Prerequisites

- Docker Engine 20.10+
- Docker Compose V2+
- At least 2GB of free RAM

## Quick Start

### 1. Create Environment File

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
# Required
OPENAI_API_KEY=sk-your-actual-openai-key

# Optional (if using LangSmith)
LANGCHAIN_API_KEY=your-langchain-key
LANGCHAIN_TRACING_V2=true
```

### 2. Choose Database Option

**Option A: Use External Neon Database (Recommended for Production)**

Set `DATABASE_URL` in `.env`:

```env
DATABASE_URL=postgresql://username:password@host.neon.tech:5432/dbname?sslmode=require
```

Then comment out the `db` service dependency in `docker-compose.yml`.

**Option B: Use Local PostgreSQL (Good for Development)**

Keep the default settings in `.env`:

```env
POSTGRES_DB=ar_automation
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

### 3. Build and Run

Build and start all services:

```bash
docker-compose up --build
```

Or run in detached mode:

```bash
docker-compose up -d --build
```

### 4. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **Backend Health**: http://localhost:8000/health
- **API Docs**: http://localhost:8000/docs

## Docker Commands

### Start Services

```bash
# Start all services
docker-compose up

# Start in background (detached mode)
docker-compose up -d

# Start and rebuild images
docker-compose up --build
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes database data)
docker-compose down -v
```

### View Logs

```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Check Service Status

```bash
docker-compose ps
```

### Execute Commands in Containers

```bash
# Backend shell
docker-compose exec backend sh

# Frontend shell
docker-compose exec frontend sh

# Database shell
docker-compose exec db psql -U postgres -d ar_automation
```

## Development Workflow

### Making Code Changes

**Backend Changes:**
1. Modify files in `python_backend/`
2. Rebuild backend service:
   ```bash
   docker-compose up -d --build backend
   ```

**Frontend Changes:**
1. Modify files in `client/`
2. Rebuild frontend service:
   ```bash
   docker-compose up -d --build frontend
   ```

### Database Migrations

If you're using the local PostgreSQL:

```bash
# Run migrations (if you have migration scripts)
docker-compose exec backend python -m alembic upgrade head
```

## Troubleshooting

### Container Won't Start

Check logs:
```bash
docker-compose logs backend
```

### Port Already in Use

Change ports in `.env`:
```env
FRONTEND_PORT=8080  # Change from 80
BACKEND_PORT=8001   # Change from 8000
```

### Database Connection Issues

**Using Neon Database:**
- Ensure `DATABASE_URL` includes `?sslmode=require`
- Check that your Neon database is accessible

**Using Local Database:**
- Wait for database to be healthy:
  ```bash
  docker-compose ps
  ```
- Check database logs:
  ```bash
  docker-compose logs db
  ```

### Build Failures

Clean up and rebuild:
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

### Frontend Can't Reach Backend

Check nginx configuration:
```bash
docker-compose exec frontend cat /etc/nginx/nginx.conf
```

Verify backend is healthy:
```bash
curl http://localhost:8000/health
```

## Production Deployment

### Environment Variables

Ensure these are set in `.env`:

```env
ENVIRONMENT=production
NODE_ENV=production
DATABASE_URL=<your-production-database-url>
OPENAI_API_KEY=<your-production-key>
```

### Using External Database

For production, it's recommended to use an external managed database (like Neon):

1. Set `DATABASE_URL` to your external database
2. Remove or comment out the `db` service in `docker-compose.yml`
3. Remove the `depends_on: db` from the backend service

### Scaling

Scale specific services:

```bash
# Run multiple backend instances
docker-compose up -d --scale backend=3
```

### Health Checks

All services have health checks configured:
- Frontend: `http://localhost/health`
- Backend: `http://localhost:8000/health`
- Database: Built-in PostgreSQL health check

## Security Notes

1. **Never commit `.env` file** - It contains sensitive API keys
2. **Change default passwords** - Update PostgreSQL password in production
3. **Use HTTPS** - In production, use a reverse proxy (Traefik, Caddy) for SSL
4. **Limit exposed ports** - Only expose ports you need externally

## Architecture Diagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Frontend       │
│  (Nginx)        │
│  Port 80        │
└────────┬────────┘
         │
         ├─────────► Static Files
         │
         └─────────► /api/* ──┐
                               │
                               ▼
                    ┌──────────────────┐
                    │  Backend         │
                    │  (FastAPI)       │
                    │  Port 8000       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Database        │
                    │  (PostgreSQL)    │
                    │  Port 5432       │
                    └──────────────────┘
```

## Volumes

Persistent data is stored in Docker volumes:

- `postgres_data` - PostgreSQL database files

View volumes:
```bash
docker volume ls
```

Backup database volume:
```bash
docker run --rm -v ar_website_v3_postgres_data:/data -v $(pwd):/backup ubuntu tar czf /backup/postgres_backup.tar.gz /data
```

## Next Steps

- Configure CI/CD pipeline for automated builds
- Set up monitoring and logging (Prometheus, Grafana)
- Add SSL certificates for production
- Configure automated backups
- Set up container orchestration (Kubernetes, Docker Swarm)

## Support

For issues or questions:
1. Check logs: `docker-compose logs`
2. Review environment variables
3. Ensure all required services are healthy
4. Check network connectivity between services
