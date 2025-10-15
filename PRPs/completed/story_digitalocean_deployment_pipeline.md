# PRP: DigitalOcean Deployment Pipeline with GitHub Actions

## Story Type

**Infrastructure/DevOps Enhancement**

## Complexity

**Medium-High**

## Story Summary

Implement an automated CI/CD pipeline that deploys the AR Automation full-stack application (React frontend + FastAPI backend + PostgreSQL) to a DigitalOcean $6 droplet whenever code is pushed to the `main` branch. The deployment uses Docker Compose for orchestration.

## Affected Systems

- GitHub Actions (CI/CD)
- DigitalOcean Infrastructure (Droplet, networking)
- Docker/Docker Compose configuration
- Application deployment scripts
- Environment configuration management

---

## Codebase Context

### Current Technology Stack

**Frontend:**

- React 18 + TypeScript
- Vite (build tool with `npm run build`)
- Port: 3000 (dev), 80 (production)

**Backend:**

- FastAPI + Python 3.11
- LangChain/LangGraph for AI
- Port: 8000
- Health endpoint: `/health`

**Database:**

- PostgreSQL 15
- Port: 5432
- Can use local Docker container

**Container Orchestration:**

- Docker Compose
- Existing `docker-compose.yml` for development
- Uses environment variables from `.env` file

### Current Docker Setup

The project already has:

- `frontend/Dockerfile` - Development dockerfile (needs production version)
- `backend/Dockerfile` - Development dockerfile (needs production version)
- `docker-compose.yml` - Development setup with hot reload volumes

**Development containers use:**

- Frontend: `npm run dev` (not suitable for production)
- Backend: `fastapi dev` with auto-reload (not suitable for production)
- Volume mounts for hot reload (not needed in production)

### Environment Configuration Pattern

The project uses `.env` file with the following key variables:

```
DATABASE_URL=postgresql://user:pass@host:port/db
POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_PORT
OPENAI_API_KEY
LANGCHAIN_API_KEY (optional)
ENVIRONMENT=production
FRONTEND_PORT=80
BACKEND_PORT=8000
```

### Application Health Checks

- Backend: `http://localhost:8000/health`
- Backend has existing healthcheck in docker-compose

### No Existing CI/CD

- No `.github/workflows/` directory exists
- No deployment automation currently in place
- No production-optimized Docker configurations

---

## Implementation Tasks

### TASK 1: CREATE Production Dockerfiles

**Priority:** Critical (blocks all other tasks)

**Action:** CREATE two new production-optimized Dockerfiles

**Details:**

1. **CREATE** `frontend/Dockerfile.prod`:

   - Multi-stage build: build stage + nginx stage
   - Build stage: Install deps, run `npm run build`, output to `dist/`
   - Nginx stage: Copy built assets from build stage, serve on port 80
   - Use `nginx:alpine` base image for small footprint
   - Include basic nginx config to serve SPA (handle client-side routing)
   - No volume mounts, no dev server

2. **CREATE** `backend/Dockerfile.prod`:
   - Single-stage optimized build
   - Use `python:3.11-slim` base image
   - Copy `requirements.txt` and install dependencies
   - Copy application code (`app/`)
   - Use production ASGI server: `uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2`
   - No fastapi dev mode, no auto-reload
   - EXPOSE 8000

**Validation:**

```bash
# Test frontend production build locally
cd frontend
docker build -f Dockerfile.prod -t ar-frontend-prod .
docker run -p 8080:80 ar-frontend-prod
# Visit http://localhost:8080

# Test backend production build locally
cd backend
docker build -f Dockerfile.prod -t ar-backend-prod .
docker run -p 8001:8000 -e DATABASE_URL="sqlite:///./test.db" -e OPENAI_API_KEY="test" ar-backend-prod
curl http://localhost:8001/health
```

---

### TASK 2: CREATE Production Docker Compose

**Priority:** Critical

**Action:** CREATE `docker-compose.prod.yml` for production deployment

**Details:**

1. **CREATE** `docker-compose.prod.yml` in project root:

   - Define 3 services: `db`, `backend`, `frontend`
   - **db service:**

     - `image: postgres:15-alpine`
     - Use environment variables from `.env`
     - Volume: `postgres_data:/var/lib/postgresql/data`
     - No exposed ports (internal network only)
     - Healthcheck with `pg_isready`

   - **backend service:**

     - `build: { context: ./backend, dockerfile: Dockerfile.prod }`
     - Depends on `db` with health condition
     - Environment: Pass all required env vars (DATABASE_URL, OPENAI_API_KEY, etc.)
     - Port: `8000:8000`
     - Restart policy: `unless-stopped`
     - Healthcheck: `curl http://localhost:8000/health`

   - **frontend service:**

     - `build: { context: ./frontend, dockerfile: Dockerfile.prod }`
     - Depends on `backend`
     - Port: `80:80`
     - Restart policy: `unless-stopped`
     - Environment: Pass `VITE_API_URL` if needed for API endpoint configuration

   - Define network: `ar_automation_network`
   - Define volume: `postgres_data`

2. Ensure services communicate via internal network
3. Only frontend and backend expose ports externally

**Validation:**

```bash
# Test production compose locally (requires .env file)
docker-compose -f docker-compose.prod.yml up --build -d
docker-compose -f docker-compose.prod.yml ps
curl http://localhost:8000/health
curl http://localhost/
docker-compose -f docker-compose.prod.yml down
```

---

### TASK 3: CREATE Deployment Shell Script

**Priority:** High

**Action:** CREATE `deploy.sh` script for server-side deployment

**Details:**

1. **CREATE** `deploy.sh` in project root:

   ```bash
   #!/bin/bash
   set -e

   echo "Starting deployment..."

   # Pull latest code
   git pull origin main

   # Stop existing containers
   docker-compose -f docker-compose.prod.yml down

   # Remove old images to free space
   docker system prune -f

   # Build and start new containers
   docker-compose -f docker-compose.prod.yml up -d --build

   # Wait for services to be healthy
   echo "Waiting for services to start..."
   sleep 10

   # Check health
   docker-compose -f docker-compose.prod.yml ps

   echo "Deployment complete!"
   ```

2. Make script executable: `chmod +x deploy.sh`

3. Script should:
   - Pull latest code from git
   - Stop old containers gracefully
   - Rebuild images with latest code
   - Start containers in detached mode
   - Verify services are running

**Validation:**

```bash
# Test script syntax
bash -n deploy.sh

# Test script execution (in test environment)
./deploy.sh
```

---

### TASK 4: CREATE GitHub Actions Workflow

**Priority:** Critical

**Action:** CREATE `.github/workflows/deploy.yml` for automated deployment

**Details:**

1. **CREATE** `.github/workflows/` directory structure

2. **CREATE** `.github/workflows/deploy.yml`:

   ```yaml
   name: Deploy to DigitalOcean

   on:
     push:
       branches: [main]
     workflow_dispatch:

   jobs:
     deploy:
       runs-on: ubuntu-latest

       steps:
         - name: Checkout code
           uses: actions/checkout@v4

         - name: Deploy to DigitalOcean
           uses: appleboy/ssh-action@v1.0.0
           with:
             host: ${{ secrets.DO_HOST }}
             username: ${{ secrets.DO_USERNAME }}
             key: ${{ secrets.DO_SSH_KEY }}
             port: 22
             script: |
               cd /root/AR_Website_v3
               ./deploy.sh
   ```

3. Workflow should:

   - Trigger on push to `main` branch
   - Also allow manual trigger via `workflow_dispatch`
   - Use SSH action to connect to droplet
   - Execute deployment script on server

4. Required GitHub Secrets (to be set in repository settings):
   - `DO_HOST`: Droplet IP address
   - `DO_USERNAME`: SSH username (typically `root`)
   - `DO_SSH_KEY`: Private SSH key for authentication

**Validation:**

```bash
# Validate workflow syntax
cat .github/workflows/deploy.yml | grep -E "^(name|on|jobs):"

# Test workflow (requires repository push to main)
git add .github/workflows/deploy.yml
git commit -m "Add deployment workflow"
git push origin main
# Check GitHub Actions tab in repository
```

---

### TASK 5: CREATE Nginx Configuration (Optional Enhancement)

**Priority:** Low (nice to have)

**Action:** CREATE proper nginx config for production frontend

**Details:**

1. **CREATE** `frontend/nginx.conf`:

   ```nginx
   server {
       listen 80;
       server_name _;

       root /usr/share/nginx/html;
       index index.html;

       # SPA fallback routing
       location / {
           try_files $uri $uri/ /index.html;
       }

       # Cache static assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }

       # API proxy (if needed)
       location /api {
           proxy_pass http://backend:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       # Health check
       location /health {
           return 200 "healthy\n";
           add_header Content-Type text/plain;
       }
   }
   ```

2. **UPDATE** `frontend/Dockerfile.prod` to copy this config:
   ```dockerfile
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   ```

**Validation:**

```bash
# Test nginx config syntax
docker run --rm -v $(pwd)/frontend/nginx.conf:/etc/nginx/conf.d/default.conf nginx:alpine nginx -t

# Test in container
docker build -f frontend/Dockerfile.prod -t test-nginx frontend/
docker run -p 8080:80 test-nginx
curl http://localhost:8080/health
```

---

### TASK 6: UPDATE Environment Example

**Priority:** Medium

**Action:** UPDATE `.env.example` with production guidance

**Details:**

1. **UPDATE** `.env.example` to include:

   - Comments for production values
   - Warnings about security
   - Database URL format for DigitalOcean Postgres
   - Port configurations for production

2. Add section:

   ```bash
   # ===========================================
   # PRODUCTION DEPLOYMENT ON DIGITALOCEAN
   # ===========================================
   # 1. Copy this file: cp .env.example .env
   # 2. Update all values below
   # 3. NEVER commit .env to git
   # 4. Use strong passwords in production

   # Database - Use DigitalOcean managed Postgres or local container
   DATABASE_URL=postgresql://user:password@localhost:5432/ar_automation
   POSTGRES_DB=ar_automation
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=CHANGE_ME_STRONG_PASSWORD

   # Required API Keys
   OPENAI_API_KEY=sk-your-actual-openai-key

   # Production Settings
   ENVIRONMENT=production
   FRONTEND_PORT=80
   BACKEND_PORT=8000
   ```

**Validation:**

```bash
# Check file exists and has proper format
cat .env.example | grep "PRODUCTION DEPLOYMENT"
```

---

### TASK 7: CREATE Deployment Documentation

**Priority:** High

**Action:** CREATE `docs/DEPLOYMENT.md` with complete setup instructions

**Details:**

1. **CREATE** `docs/DEPLOYMENT.md` with comprehensive guide including:

   **A. DigitalOcean Droplet Setup:**

   - Create $6 Basic Droplet (1GB RAM, 1 CPU, 25GB SSD)
   - Choose Ubuntu 22.04 LTS
   - Select datacenter region (closest to users)
   - Add SSH key for authentication
   - Optional: Enable monitoring and backups

   **B. Server Initial Setup:**

   ```bash
   # SSH into droplet
   ssh root@YOUR_DROPLET_IP

   # Update system
   apt update && apt upgrade -y

   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh

   # Install Docker Compose
   apt install docker-compose-plugin -y

   # Verify installations
   docker --version
   docker compose version

   # Install git
   apt install git -y
   ```

   **C. Clone Repository:**

   ```bash
   cd /root
   git clone https://github.com/YOUR_USERNAME/AR_Website_v3.git
   cd AR_Website_v3
   ```

   **D. Configure Environment:**

   ```bash
   # Create .env file
   cp .env.example .env
   nano .env

   # Update these values:
   # - DATABASE_URL (or Postgres credentials)
   # - OPENAI_API_KEY
   # - Strong POSTGRES_PASSWORD
   # - ENVIRONMENT=production
   ```

   **E. Initial Deployment:**

   ```bash
   # Make deploy script executable
   chmod +x deploy.sh

   # Run first deployment
   ./deploy.sh

   # Check services are running
   docker ps
   curl http://localhost:8000/health
   ```

   **F. Configure GitHub Secrets:**

   - Go to GitHub repository Settings → Secrets and variables → Actions
   - Add secrets:
     - `DO_HOST`: Your droplet IP address
     - `DO_USERNAME`: `root`
     - `DO_SSH_KEY`: Your private SSH key content

   **G. Setup SSH Keys for GitHub Actions:**

   ```bash
   # On your local machine, generate SSH key if you don't have one
   ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/do_deploy

   # Copy public key to droplet
   ssh-copy-id -i ~/.ssh/do_deploy.pub root@YOUR_DROPLET_IP

   # Copy private key content to GitHub secret DO_SSH_KEY
   cat ~/.ssh/do_deploy
   ```

   **H. Firewall Setup:**

   ```bash
   # On droplet
   ufw allow OpenSSH
   ufw allow 80/tcp
   ufw allow 8000/tcp
   ufw enable
   ufw status
   ```

   **I. Domain Setup (Optional):**

   - Point A record to droplet IP
   - Update nginx config with domain name
   - Setup SSL with Let's Encrypt (certbot)

   **J. Monitoring and Maintenance:**

   ```bash
   # View logs
   docker-compose -f docker-compose.prod.yml logs -f

   # Restart services
   docker-compose -f docker-compose.prod.yml restart

   # Check disk space
   df -h

   # Clean up Docker
   docker system prune -a
   ```

   **K. Troubleshooting:**

   - Common issues and solutions
   - How to access container logs
   - Database connection issues
   - Memory constraints on $6 droplet

2. Include security best practices
3. Include rollback procedures
4. Include scaling considerations

**Validation:**

```bash
# Check documentation is complete
cat docs/DEPLOYMENT.md | grep -E "^##"
```

---

### TASK 8: CREATE Quick Reference Card

**Priority:** Low

**Action:** CREATE `docs/DEPLOYMENT_QUICK_REF.md` with common commands

**Details:**

1. **CREATE** `docs/DEPLOYMENT_QUICK_REF.md`:

   - Quick command reference for common operations
   - Organized by task category

   **Sections:**

   - SSH Access
   - Viewing Logs
   - Restarting Services
   - Manual Deployment
   - Checking Status
   - Emergency Rollback
   - Database Access

**Validation:**

```bash
# Verify file exists
test -f docs/DEPLOYMENT_QUICK_REF.md && echo "Quick reference exists"
```

---

### TASK 9: UPDATE Root README

**Priority:** Medium

**Action:** UPDATE `README.md` to reference deployment docs

**Details:**

1. **UPDATE** `README.md`:

   - Add "Deployment" section after "Docker Deployment"
   - Link to `docs/DEPLOYMENT.md`
   - Brief overview of automated deployment
   - Mention it deploys on push to main

2. Add section:

   ````markdown
   ## Production Deployment

   This application automatically deploys to DigitalOcean when code is pushed to the `main` branch.

   ### Automated Deployment

   - **Trigger:** Push to `main` branch
   - **Platform:** DigitalOcean $6 Droplet
   - **Orchestration:** Docker Compose
   - **CI/CD:** GitHub Actions

   ### Setup Instructions

   For complete deployment setup instructions, see [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md).

   ### Quick Deploy

   ```bash
   # Manual deployment on server
   ssh root@YOUR_DROPLET_IP
   cd /root/AR_Website_v3
   ./deploy.sh
   ```
   ````

   ### Monitoring

   - Application: http://YOUR_DROPLET_IP
   - API Health: http://YOUR_DROPLET_IP:8000/health
   - Logs: `docker-compose -f docker-compose.prod.yml logs -f`

   ```

   ```

**Validation:**

```bash
# Check README has deployment section
grep -A 5 "Production Deployment" README.md
```

---

### TASK 10: CREATE .dockerignore for Production

**Priority:** Medium

**Action:** UPDATE existing `.dockerignore` or CREATE optimized version

**Details:**

1. **CHECK** if `.dockerignore` exists, if not **CREATE** one

2. Ensure `.dockerignore` includes:

   ```
   # Development files
   .git
   .github
   .env
   .env.*

   # Node modules (will be installed in container)
   **/node_modules

   # Python cache
   **/__pycache__
   **/*.pyc
   **/*.pyo
   **/*.pyd
   .Python

   # Build outputs (frontend)
   **/dist
   **/build

   # IDE files
   .vscode
   .idea
   **/.DS_Store

   # Logs
   **/*.log

   # Docker files
   **/Dockerfile
   **/docker-compose*.yml

   # Documentation
   docs/
   *.md

   # Tests
   **/tests
   **/*.test.*
   **/*.spec.*
   ```

**Validation:**

```bash
# Check .dockerignore exists
test -f .dockerignore && echo ".dockerignore exists"

# Test it's being used
docker build -f frontend/Dockerfile.prod -t test-ignore frontend/ 2>&1 | grep -i "ignore"
```

---

## External Dependencies

### Required GitHub Action

- **appleboy/ssh-action@v1.0.0** - For SSH deployment to DigitalOcean
- Purpose: Securely connects to droplet and executes deployment script
- Alternative: Manual SSH in workflow with ssh-keyscan

### DigitalOcean Resources

- **Droplet:** $6/month Basic plan (1GB RAM, 1 CPU, 25GB SSD, 1TB transfer)
- **Managed PostgreSQL** (Optional): $15/month for 1GB RAM (alternative to containerized DB)
- **Backups** (Optional): 20% of droplet cost for automated backups

### Required on DigitalOcean Droplet

- Ubuntu 22.04 LTS
- Docker Engine 24+
- Docker Compose V2
- Git

---

## Security Considerations

1. **Secrets Management:**

   - Use GitHub Secrets for sensitive data (SSH keys, IP addresses)
   - Never commit `.env` file
   - Use strong passwords for PostgreSQL in production

2. **SSH Security:**

   - Use SSH keys (not passwords)
   - Consider creating dedicated deploy user (instead of root)
   - Restrict SSH access with firewall rules

3. **Container Security:**

   - Production images run as non-root user (optional enhancement)
   - No development dependencies in production images
   - Regular security updates: `apt update && apt upgrade`

4. **Database Security:**

   - PostgreSQL not exposed publicly (internal network only)
   - Strong database password
   - Consider managed PostgreSQL for automatic backups

5. **API Keys:**
   - OpenAI API key stored in `.env` (never in code)
   - Consider using DigitalOcean App Platform secrets manager

---

## Environment Variables Summary

Required in `.env` on DigitalOcean droplet:

```bash
# Database
DATABASE_URL=postgresql://postgres:STRONG_PASSWORD@db:5432/ar_automation
POSTGRES_DB=ar_automation
POSTGRES_USER=postgres
POSTGRES_PASSWORD=STRONG_PASSWORD_HERE

# API Keys
OPENAI_API_KEY=sk-your-real-openai-key-here
LANGCHAIN_API_KEY=optional-langchain-key
LANGCHAIN_TRACING_V2=false
LANGCHAIN_PROJECT=ar-automation

# Environment
ENVIRONMENT=production
NODE_ENV=production

# Ports
FRONTEND_PORT=80
BACKEND_PORT=8000
```

Required in GitHub Secrets:

```
DO_HOST=123.456.789.012
DO_USERNAME=root
DO_SSH_KEY=<contents of private SSH key>
```

---

## Testing Strategy

### Local Testing

1. Test production Dockerfiles individually
2. Test production docker-compose locally
3. Test deployment script locally

### Staging Testing (Optional)

1. Create separate $6 droplet for staging
2. Test full deployment pipeline on staging
3. Verify all services work on staging

### Production Testing

1. Initial manual deployment to verify setup
2. Test automated GitHub Actions deployment
3. Monitor first few deployments closely
4. Set up health checks and alerting

---

## Rollback Procedure

If deployment fails:

```bash
# SSH into droplet
ssh root@YOUR_DROPLET_IP

# Go to project directory
cd /root/AR_Website_v3

# Check git log for last working commit
git log --oneline -5

# Rollback to previous commit
git checkout <previous-commit-hash>

# Redeploy
./deploy.sh

# Or restore containers from backup
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

---

## Performance Considerations

### $6 Droplet Limitations

- **1GB RAM:** Sufficient for small-medium traffic
- **1 CPU:** Single-threaded performance
- **25GB Disk:** Monitor disk usage, clean up Docker regularly

### Optimization Tips

1. **Backend:** Use 2 uvicorn workers (configured in Dockerfile.prod)
2. **Frontend:** Nginx serves static files efficiently
3. **Database:** Consider managed Postgres for better performance
4. **Monitoring:** Watch memory usage: `docker stats`
5. **Cleanup:** Run `docker system prune` regularly

### Scaling Path

When traffic grows:

1. Upgrade to $12 droplet (2GB RAM)
2. Move to managed PostgreSQL database
3. Add Redis for caching
4. Consider DigitalOcean App Platform for auto-scaling

---

## Success Metrics

**Deployment Successful When:**

- [ ] Push to `main` branch triggers GitHub Actions
- [ ] GitHub Actions connects to droplet via SSH
- [ ] Deployment script runs successfully
- [ ] All 3 containers (db, backend, frontend) are running
- [ ] Backend health endpoint returns 200 OK
- [ ] Frontend serves main page
- [ ] Database accepts connections
- [ ] Application is accessible via droplet IP
- [ ] Subsequent pushes trigger redeployment

**Operational Success:**

- [ ] Deployment completes in < 5 minutes
- [ ] Zero-downtime deployments (future enhancement)
- [ ] Logs available via `docker-compose logs`
- [ ] Services auto-restart on failure

---

## Future Enhancements

**Not included in this PRP but consider later:**

1. **Zero-downtime deployment:**

   - Blue-green deployment strategy
   - Health checks before switching

2. **SSL/HTTPS:**

   - Let's Encrypt certificate
   - Automatic renewal with certbot

3. **Monitoring:**

   - DigitalOcean monitoring dashboard
   - Uptime monitoring (UptimeRobot, Pingdom)
   - Log aggregation (Papertrail, Logtail)

4. **Backups:**

   - Automated database backups
   - DigitalOcean Droplet snapshots

5. **CI Improvements:**

   - Run tests before deployment
   - Build notifications (Slack, Discord)
   - Staging environment

6. **Load Balancing:**
   - Multiple droplets behind load balancer
   - DigitalOcean Load Balancer ($12/month)

---

## Estimated Time

- **Setup DigitalOcean:** 30 minutes
- **Create production configs:** 1-2 hours
- **Write deployment script:** 30 minutes
- **Setup GitHub Actions:** 1 hour
- **Testing and debugging:** 1-2 hours
- **Documentation:** 1 hour

**Total:** 5-7 hours for complete implementation and testing

---

## Dependencies Between Tasks

```
TASK 1 (Dockerfiles) → TASK 2 (Docker Compose) → TASK 3 (Deploy Script)
                                                      ↓
                                                 TASK 4 (GitHub Actions)
                                                      ↓
                                                 TASK 7 (Documentation)

TASK 5 (Nginx) → Can be done alongside TASK 1
TASK 6, 8, 9, 10 → Can be done independently
```

**Recommended Order:**

1. TASK 1 + TASK 10 (Dockerfiles + .dockerignore)
2. TASK 2 (Docker Compose production)
3. TASK 5 (Nginx config - optional but recommended)
4. TASK 3 (Deploy script)
5. TASK 4 (GitHub Actions)
6. TASK 6 (Environment example)
7. TASK 7 (Main documentation)
8. TASK 8 (Quick reference)
9. TASK 9 (Update README)

---

## Implementation Notes for Agent

**IMPORTANT:**

- The existing Dockerfiles are for **development** (hot reload, dev servers)
- Production Dockerfiles must be **separate files** (`.prod` suffix)
- Do NOT modify existing development docker-compose.yml
- Test each component locally before moving to DigitalOcean setup
- The $6 droplet has limited resources - optimize builds
- Ensure proper error handling in deployment script
- GitHub Actions will fail until secrets are configured (expected)

**When Creating Documentation:**

- Be thorough but concise
- Include copy-paste ready commands
- Provide troubleshooting steps
- Assume reader has basic Docker/Linux knowledge
- Include warnings about security and costs

**Testing Approach:**

- Test Dockerfiles locally first
- Test docker-compose.prod.yml locally
- Test deployment script (can simulate without server)
- GitHub Actions will need actual droplet to test fully
