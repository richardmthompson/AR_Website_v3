# Deployment Quick Reference

Quick command reference for common deployment operations on DigitalOcean.

## SSH Access

```bash
# Connect to droplet
ssh root@YOUR_DROPLET_IP

# Using specific SSH key
ssh -i ~/.ssh/your_key root@YOUR_DROPLET_IP

# Copy file to droplet
scp local_file.txt root@YOUR_DROPLET_IP:/root/

# Copy file from droplet
scp root@YOUR_DROPLET_IP:/root/file.txt ./
```

---

## Deployment Commands

```bash
# Navigate to project
cd /root/AR_Website_v3

# Run automated deployment
./deploy.sh

# Manual deployment steps
git pull origin main
docker-compose -f docker-compose.prod.yml down
docker system prune -f
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## Viewing Logs

```bash
# All services (follow mode)
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f db

# Last 100 lines
docker-compose -f docker-compose.prod.yml logs --tail=100

# Last 100 lines of specific service
docker-compose -f docker-compose.prod.yml logs --tail=100 backend

# Logs since timestamp
docker-compose -f docker-compose.prod.yml logs --since 2024-10-15T10:00:00

# Save logs to file
docker-compose -f docker-compose.prod.yml logs > logs_$(date +%Y%m%d_%H%M%S).txt
```

---

## Service Management

```bash
# List running containers
docker ps

# Check service status
docker-compose -f docker-compose.prod.yml ps

# Start all services
docker-compose -f docker-compose.prod.yml up -d

# Stop all services
docker-compose -f docker-compose.prod.yml down

# Restart all services
docker-compose -f docker-compose.prod.yml restart

# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend

# Stop specific service
docker-compose -f docker-compose.prod.yml stop frontend

# Start specific service
docker-compose -f docker-compose.prod.yml start frontend

# Rebuild and restart specific service
docker-compose -f docker-compose.prod.yml up -d --build backend
```

---

## Checking Status

```bash
# Application health
curl http://localhost:8000/health

# Frontend
curl http://localhost/

# Backend API docs
curl http://localhost:8000/docs

# Check which ports are in use
netstat -tulpn | grep LISTEN

# Resource usage (real-time)
docker stats

# Disk usage
df -h

# Docker disk usage
docker system df
```

---

## Database Operations

```bash
# Access PostgreSQL shell
docker exec -it ar_automation_db_prod psql -U postgres ar_automation

# Backup database
docker exec ar_automation_db_prod pg_dump -U postgres ar_automation > backup_$(date +%Y%m%d).sql

# Restore database
cat backup_20241015.sql | docker exec -i ar_automation_db_prod psql -U postgres ar_automation

# List databases
docker exec -it ar_automation_db_prod psql -U postgres -c "\l"

# Check database size
docker exec -it ar_automation_db_prod psql -U postgres -c "\l+" ar_automation

# View database tables
docker exec -it ar_automation_db_prod psql -U postgres ar_automation -c "\dt"

# Run SQL query
docker exec -it ar_automation_db_prod psql -U postgres ar_automation -c "SELECT COUNT(*) FROM your_table;"
```

---

## System Monitoring

```bash
# Real-time system monitor
htop

# Memory usage
free -h

# Disk usage by directory
du -sh /var/lib/docker/*

# Check system load
uptime

# View running processes
ps aux

# Network connections
netstat -an

# Check disk I/O
iostat
```

---

## Cleanup Operations

```bash
# Remove unused Docker data (images, containers, volumes)
docker system prune -a -f

# Remove only unused images
docker image prune -a -f

# Remove stopped containers
docker container prune -f

# Remove unused volumes
docker volume prune -f

# Remove unused networks
docker network prune -f

# Remove everything (DANGEROUS)
docker system prune -a --volumes -f

# Clean apt cache
apt clean
apt autoremove -y
```

---

## Emergency Rollback

```bash
# Navigate to project
cd /root/AR_Website_v3

# View recent commits
git log --oneline -10

# Rollback to specific commit
git checkout COMMIT_HASH

# Or rollback to previous commit
git checkout HEAD~1

# Redeploy with old code
./deploy.sh

# Return to main branch
git checkout main
git pull origin main
```

---

## Configuration Updates

```bash
# Edit environment variables
nano /root/AR_Website_v3/.env

# After editing .env, restart services
docker-compose -f docker-compose.prod.yml restart

# Edit nginx config
nano /root/AR_Website_v3/frontend/nginx.conf

# Rebuild frontend after nginx changes
docker-compose -f docker-compose.prod.yml up -d --build frontend

# View current environment
docker-compose -f docker-compose.prod.yml config
```

---

## Firewall Management

```bash
# Check firewall status
ufw status verbose

# Allow port
ufw allow 80/tcp

# Deny port
ufw deny 3000/tcp

# Delete rule
ufw delete allow 80/tcp

# Enable/disable firewall
ufw enable
ufw disable

# Reset firewall (remove all rules)
ufw --force reset
```

---

## System Updates

```bash
# Update package list
apt update

# Upgrade packages
apt upgrade -y

# Full system upgrade
apt full-upgrade -y

# Reboot server (use with caution)
reboot

# Check if reboot is required
[ -f /var/run/reboot-required ] && echo "Reboot required" || echo "No reboot needed"
```

---

## Docker Compose Shortcuts

```bash
# Shorthand variable
alias dcprod='docker-compose -f docker-compose.prod.yml'

# Usage examples with alias
dcprod ps
dcprod logs -f
dcprod restart backend
dcprod up -d --build

# Make alias permanent
echo "alias dcprod='docker-compose -f docker-compose.prod.yml'" >> ~/.bashrc
source ~/.bashrc
```

---

## Health Checks

```bash
# Backend health
curl -f http://localhost:8000/health && echo "✓ Backend healthy" || echo "✗ Backend unhealthy"

# Frontend health
curl -f http://localhost/ && echo "✓ Frontend healthy" || echo "✗ Frontend unhealthy"

# Database health
docker exec ar_automation_db_prod pg_isready -U postgres && echo "✓ Database healthy" || echo "✗ Database unhealthy"

# All services health check script
#!/bin/bash
echo "Checking service health..."
curl -sf http://localhost:8000/health && echo "✓ Backend: healthy" || echo "✗ Backend: down"
curl -sf http://localhost/ && echo "✓ Frontend: healthy" || echo "✗ Frontend: down"
docker exec ar_automation_db_prod pg_isready -U postgres && echo "✓ Database: healthy" || echo "✗ Database: down"
```

---

## Performance Analysis

```bash
# Check container resource usage
docker stats --no-stream

# Check specific container
docker stats ar_automation_backend_prod --no-stream

# View container processes
docker top ar_automation_backend_prod

# Inspect container
docker inspect ar_automation_backend_prod

# View container logs with timestamps
docker-compose -f docker-compose.prod.yml logs -f --timestamps backend
```

---

## Troubleshooting Commands

```bash
# Check if ports are available
netstat -tulpn | grep :80
netstat -tulpn | grep :8000

# Test database connection from backend
docker exec -it ar_automation_backend_prod python -c "import psycopg2; conn = psycopg2.connect('${DATABASE_URL}'); print('DB Connected')"

# View environment variables in container
docker exec ar_automation_backend_prod env

# Execute shell in container
docker exec -it ar_automation_backend_prod sh

# View container filesystem
docker exec ar_automation_backend_prod ls -la /code

# Check nginx configuration
docker exec ar_automation_frontend_prod nginx -t

# Reload nginx (without restart)
docker exec ar_automation_frontend_prod nginx -s reload
```

---

## Git Operations

```bash
# Check current branch and status
git status

# View recent commits
git log --oneline -10

# Pull latest changes
git pull origin main

# Discard local changes
git reset --hard origin/main

# View diff
git diff

# Check remote URL
git remote -v

# Force update from remote (DANGEROUS)
git fetch origin
git reset --hard origin/main
```

---

## GitHub Actions

```bash
# Trigger manual deployment from local machine
gh workflow run deploy.yml

# View workflow status
gh run list

# View specific run logs
gh run view RUN_ID --log

# Cancel running workflow
gh run cancel RUN_ID
```

---

## Useful One-Liners

```bash
# Kill all Docker containers
docker kill $(docker ps -q)

# Remove all Docker containers
docker rm $(docker ps -a -q)

# Remove all Docker images
docker rmi $(docker images -q)

# Show disk usage by Docker
docker system df -v

# Follow logs of all services with grep filter
docker-compose -f docker-compose.prod.yml logs -f | grep ERROR

# Count number of requests in logs
docker-compose -f docker-compose.prod.yml logs backend | grep "GET" | wc -l

# Find large files
find /var/lib/docker -type f -size +100M -exec ls -lh {} \;
```

---

## Quick Diagnostic Script

Save as `diagnostic.sh`:

```bash
#!/bin/bash
echo "=== AR Automation Diagnostics ==="
echo ""
echo "Date: $(date)"
echo ""
echo "=== Disk Usage ==="
df -h
echo ""
echo "=== Memory Usage ==="
free -h
echo ""
echo "=== Docker Containers ==="
docker ps
echo ""
echo "=== Service Health ==="
curl -sf http://localhost:8000/health && echo "✓ Backend: healthy" || echo "✗ Backend: down"
curl -sf http://localhost/ && echo "✓ Frontend: healthy" || echo "✗ Frontend: down"
docker exec ar_automation_db_prod pg_isready -U postgres && echo "✓ Database: healthy" || echo "✗ Database: down"
echo ""
echo "=== Docker Resource Usage ==="
docker stats --no-stream
echo ""
echo "=== Recent Logs (Last 20 lines) ==="
docker-compose -f /root/AR_Website_v3/docker-compose.prod.yml logs --tail=20
```

Make executable:
```bash
chmod +x diagnostic.sh
./diagnostic.sh
```

---

## Important File Locations

```
/root/AR_Website_v3/              # Project root
/root/AR_Website_v3/.env           # Environment variables
/root/AR_Website_v3/deploy.sh      # Deployment script
/root/AR_Website_v3/docker-compose.prod.yml  # Production compose file
/var/lib/docker/volumes/           # Docker volumes
/etc/letsencrypt/                  # SSL certificates (if using Let's Encrypt)
~/.ssh/authorized_keys             # SSH authorized keys
```

---

## Getting Help

- Full deployment guide: `docs/DEPLOYMENT.md`
- Docker docs: https://docs.docker.com
- DigitalOcean tutorials: https://www.digitalocean.com/community/tutorials
- GitHub Actions docs: https://docs.github.com/en/actions

---

## Emergency Contacts

**Critical Issues:**
1. Check logs: `docker-compose -f docker-compose.prod.yml logs -f`
2. Check status: `docker ps`
3. Run diagnostics: `./diagnostic.sh`
4. Restart services: `docker-compose -f docker-compose.prod.yml restart`
5. Full redeploy: `./deploy.sh`

**If all else fails:**
- Rollback to previous version
- Restore from backup
- Contact support with logs and error messages
