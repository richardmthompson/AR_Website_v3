# AR Automation - DigitalOcean Deployment Guide

Complete guide for deploying the AR Automation full-stack application to DigitalOcean using automated CI/CD with GitHub Actions.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Part 1: DigitalOcean Droplet Setup](#part-1-digitalocean-droplet-setup)
- [Part 2: Server Initial Setup](#part-2-server-initial-setup)
- [Part 3: Clone Repository](#part-3-clone-repository)
- [Part 4: Configure Environment](#part-4-configure-environment)
- [Part 5: Initial Deployment](#part-5-initial-deployment)
- [Part 6: Setup GitHub Actions](#part-6-setup-github-actions)
- [Part 7: Firewall Configuration](#part-7-firewall-configuration)
- [Part 8: Domain Setup (Optional)](#part-8-domain-setup-optional)
- [Part 9: Monitoring and Maintenance](#part-9-monitoring-and-maintenance)
- [Troubleshooting](#troubleshooting)

---

## Overview

This deployment pipeline:
- Automatically deploys on push to `main` branch
- Uses Docker Compose for orchestration
- Runs on a $6/month DigitalOcean droplet
- Includes React frontend, FastAPI backend, and PostgreSQL database

**Architecture:**
```
GitHub → GitHub Actions → SSH → DigitalOcean Droplet → Docker Compose
```

---

## Prerequisites

Before starting, you need:

1. **GitHub Account** with your AR_Website_v3 repository
2. **DigitalOcean Account** - Sign up at https://digitalocean.com
3. **Local SSH Key** for server authentication
4. **OpenAI API Key** for the AI features
5. **Domain Name** (optional) for custom URL

**Estimated Setup Time:** 30-60 minutes

---

## Part 1: DigitalOcean Droplet Setup

### Create a Droplet

1. Log into DigitalOcean: https://cloud.digitalocean.com

2. Click **Create** → **Droplets**

3. **Choose Region:**
   - Select datacenter closest to your users
   - Recommended: New York, San Francisco, or London

4. **Choose Image:**
   - Distribution: **Ubuntu 22.04 LTS**

5. **Choose Size:**
   - Droplet Type: **Basic**
   - CPU Options: **Regular**
   - Plan: **$6/month** (1 GB RAM / 1 CPU / 25 GB SSD / 1 TB transfer)

6. **Authentication:**
   - Select **SSH Key** (recommended)
   - Click **New SSH Key** if you don't have one
   - Paste your public SSH key (see below if you need to create one)

7. **Finalize Details:**
   - Hostname: `ar-automation-prod` (or your choice)
   - Enable backups: Optional (+$1.20/month)
   - Enable monitoring: Yes (free)

8. Click **Create Droplet**

9. **Note your Droplet IP:** You'll see it after creation (e.g., `123.456.789.012`)

### Create SSH Key (if needed)

```bash
# On your local machine
ssh-keygen -t ed25519 -C "your-email@example.com" -f ~/.ssh/do_ar_automation

# Display public key to paste into DigitalOcean
cat ~/.ssh/do_ar_automation.pub
```

---

## Part 2: Server Initial Setup

### Connect to Your Droplet

```bash
# SSH into your droplet (replace with your droplet IP)
ssh root@YOUR_DROPLET_IP

# If using a specific SSH key
ssh -i ~/.ssh/do_ar_automation root@YOUR_DROPLET_IP
```

### Update System

```bash
# Update package list
apt update

# Upgrade existing packages
apt upgrade -y
```

### Install Docker

```bash
# Download Docker installation script
curl -fsSL https://get.docker.com -o get-docker.sh

# Run installation
sh get-docker.sh

# Verify Docker installation
docker --version
# Should output: Docker version 24.x.x or higher
```

### Install Docker Compose V2

```bash
# Docker Compose V2 comes with Docker Engine
# Verify installation
docker compose version
# Should output: Docker Compose version v2.x.x or higher
```

### Install Git

```bash
# Install Git
apt install git -y

# Verify installation
git --version
```

### Install Additional Tools

```bash
# Install curl (for health checks)
apt install curl -y

# Install htop (for monitoring)
apt install htop -y
```

---

## Part 3: Clone Repository

### Setup GitHub Authentication

```bash
# Navigate to root directory
cd /root

# Clone your repository (use HTTPS or SSH)
# Option 1: HTTPS (will prompt for credentials)
git clone https://github.com/YOUR_USERNAME/AR_Website_v3.git

# Option 2: SSH (requires GitHub SSH key setup)
# git clone git@github.com:YOUR_USERNAME/AR_Website_v3.git
```

### For Private Repositories

If your repository is private, you'll need a GitHub Personal Access Token:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Use token as password when cloning:

```bash
git clone https://github.com/YOUR_USERNAME/AR_Website_v3.git
Username: YOUR_USERNAME
Password: YOUR_TOKEN
```

### Verify Clone

```bash
cd /root/AR_Website_v3
ls -la
# Should see: frontend/, backend/, docker-compose.prod.yml, deploy.sh, etc.
```

---

## Part 4: Configure Environment

### Create Environment File

```bash
# Navigate to project directory
cd /root/AR_Website_v3

# Copy example environment file
cp .env.example .env

# Edit environment file
nano .env
```

### Required Environment Variables

Update these values in `.env`:

```bash
# ===========================================
# PRODUCTION ENVIRONMENT VARIABLES
# ===========================================

# Database Configuration
DATABASE_URL=postgresql://postgres:YOUR_STRONG_PASSWORD_HERE@db:5432/ar_automation
POSTGRES_DB=ar_automation
POSTGRES_USER=postgres
POSTGRES_PASSWORD=YOUR_STRONG_PASSWORD_HERE

# API Keys (REQUIRED)
OPENAI_API_KEY=sk-YOUR_ACTUAL_OPENAI_API_KEY

# Optional: LangChain (for tracing/debugging)
LANGCHAIN_API_KEY=your-langchain-key-here
LANGCHAIN_TRACING_V2=false
LANGCHAIN_PROJECT=ar-automation

# Application Settings
ENVIRONMENT=production
NODE_ENV=production

# Port Configuration
FRONTEND_PORT=80
BACKEND_PORT=8000
```

### Security Best Practices

- **Strong Passwords:** Use at least 20 characters with mixed case, numbers, symbols
- **Never commit .env:** The `.gitignore` already excludes this file
- **Rotate keys regularly:** Change passwords every 90 days

### Generate Strong Password

```bash
# Generate a random 32-character password
openssl rand -base64 32
```

---

## Part 5: Initial Deployment

### Make Deploy Script Executable

```bash
cd /root/AR_Website_v3
chmod +x deploy.sh
```

### Run First Deployment

```bash
# Execute deployment script
./deploy.sh
```

This script will:
1. Pull latest code from git
2. Stop any existing containers
3. Clean up old Docker images
4. Build new images
5. Start containers in detached mode

**Expected output:**
```
======================================
  AR Automation Deployment Script
======================================

[1/5] Pulling latest code from main branch...
✓ Code updated

[2/5] Stopping existing containers...
✓ Containers stopped

[3/5] Cleaning up old Docker images...
✓ Cleanup complete

[4/5] Building and starting new containers...
✓ Containers started

[5/5] Waiting for services to start...

Service status:
NAME                           STATUS    PORTS
ar_automation_db_prod          running   5432/tcp
ar_automation_backend_prod     running   0.0.0.0:8000->8000/tcp
ar_automation_frontend_prod    running   0.0.0.0:80->80/tcp

✓ Backend is healthy

======================================
  Deployment Complete!
======================================
```

### Verify Deployment

```bash
# Check running containers
docker ps

# Check backend health
curl http://localhost:8000/health

# Check frontend
curl http://localhost/

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Test in Browser

1. Open browser and navigate to: `http://YOUR_DROPLET_IP`
2. You should see the AR Automation frontend
3. Test API: `http://YOUR_DROPLET_IP:8000/health`

---

## Part 6: Setup GitHub Actions

### Generate SSH Key for GitHub Actions

On your **local machine** (not on the droplet):

```bash
# Generate dedicated SSH key for deployments
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy

# Do not set a passphrase (press Enter when prompted)
```

### Add Public Key to Droplet

```bash
# Copy public key
cat ~/.ssh/github_actions_deploy.pub

# SSH into your droplet
ssh root@YOUR_DROPLET_IP

# Add key to authorized_keys
echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys

# Verify permissions
chmod 600 ~/.ssh/authorized_keys
```

### Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

Add these three secrets:

#### Secret 1: DO_HOST
- **Name:** `DO_HOST`
- **Value:** Your droplet IP address (e.g., `123.456.789.012`)

#### Secret 2: DO_USERNAME
- **Name:** `DO_USERNAME`
- **Value:** `root`

#### Secret 3: DO_SSH_KEY
- **Name:** `DO_SSH_KEY`
- **Value:** Your private SSH key

```bash
# On your local machine, copy private key
cat ~/.ssh/github_actions_deploy

# Copy the entire output including:
# -----BEGIN OPENSSH PRIVATE KEY-----
# ... key content ...
# -----END OPENSSH PRIVATE KEY-----
```

### Test GitHub Actions

```bash
# On your local machine, make a small change
echo "# Test deployment" >> README.md

# Commit and push
git add README.md
git commit -m "Test automated deployment"
git push origin main
```

### Verify Deployment

1. Go to GitHub repository → **Actions** tab
2. You should see your workflow running
3. Click on the workflow to see logs
4. Deployment should complete successfully

---

## Part 7: Firewall Configuration

### Setup UFW (Uncomplicated Firewall)

```bash
# SSH into your droplet
ssh root@YOUR_DROPLET_IP

# Allow SSH (IMPORTANT: Do this first!)
ufw allow OpenSSH

# Allow HTTP (port 80)
ufw allow 80/tcp

# Allow HTTPS (port 443) - for future SSL
ufw allow 443/tcp

# Allow backend API (port 8000)
ufw allow 8000/tcp

# Enable firewall
ufw enable

# Verify rules
ufw status verbose
```

**Expected output:**
```
Status: active

To                         Action      From
--                         ------      ----
22/tcp (OpenSSH)          ALLOW       Anywhere
80/tcp                    ALLOW       Anywhere
443/tcp                   ALLOW       Anywhere
8000/tcp                  ALLOW       Anywhere
```

### DigitalOcean Cloud Firewall (Optional)

For additional security, create a Cloud Firewall:

1. Go to DigitalOcean → **Networking** → **Firewalls**
2. Click **Create Firewall**
3. Add **Inbound Rules:**
   - SSH (22) from your IP only
   - HTTP (80) from all sources
   - HTTPS (443) from all sources
   - Custom (8000) from all sources
4. Apply to your droplet

---

## Part 8: Domain Setup (Optional)

### Point Domain to Droplet

1. Go to your domain registrar (Namecheap, GoDaddy, etc.)
2. Add an **A Record:**
   - **Host:** `@` (or `www`)
   - **Value:** Your droplet IP
   - **TTL:** 300 (5 minutes)

3. Wait for DNS propagation (5-30 minutes)

### Test Domain

```bash
# Check DNS resolution
dig yourdomain.com

# Or use nslookup
nslookup yourdomain.com
```

### Update Nginx Configuration (if using domain)

```bash
# Edit nginx config on droplet
nano /root/AR_Website_v3/frontend/nginx.conf

# Change server_name from _ to your domain
server_name yourdomain.com www.yourdomain.com;

# Rebuild frontend
docker-compose -f docker-compose.prod.yml up -d --build frontend
```

### Setup SSL with Let's Encrypt (Recommended)

```bash
# Install certbot
apt install certbot python3-certbot-nginx -y

# Stop nginx container temporarily
docker-compose -f docker-compose.prod.yml stop frontend

# Obtain certificate
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Certificate will be saved to:
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/yourdomain.com/privkey.pem

# Update docker-compose to mount certificates (advanced)
# Or use a reverse proxy like Traefik or Caddy
```

---

## Part 9: Monitoring and Maintenance

### View Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f db

# Last 100 lines
docker-compose -f docker-compose.prod.yml logs --tail=100
```

### Check Service Status

```bash
# List running containers
docker ps

# Check service health
docker-compose -f docker-compose.prod.yml ps

# View resource usage
docker stats
```

### Monitor Disk Space

```bash
# Check disk usage
df -h

# Check Docker disk usage
docker system df

# Clean up old Docker data
docker system prune -a
```

### Monitor Memory Usage

```bash
# Install htop if not already installed
apt install htop -y

# View real-time resource usage
htop

# Or use top
top
```

### Restart Services

```bash
# Restart all services
docker-compose -f docker-compose.prod.yml restart

# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend
```

### Update Application

```bash
# Manual update (or wait for GitHub Actions)
cd /root/AR_Website_v3
./deploy.sh
```

### Database Backup

```bash
# Backup PostgreSQL database
docker exec ar_automation_db_prod pg_dump -U postgres ar_automation > backup_$(date +%Y%m%d).sql

# Restore from backup
cat backup_20241015.sql | docker exec -i ar_automation_db_prod psql -U postgres ar_automation
```

### Regular Maintenance Tasks

**Weekly:**
- Check disk space: `df -h`
- Review logs for errors
- Monitor resource usage

**Monthly:**
- Update system packages: `apt update && apt upgrade -y`
- Clean Docker: `docker system prune -a`
- Backup database
- Review security updates

**Quarterly:**
- Rotate passwords
- Review firewall rules
- Test disaster recovery

---

## Troubleshooting

### Issue: Containers Won't Start

**Check logs:**
```bash
docker-compose -f docker-compose.prod.yml logs
```

**Common causes:**
- Port already in use
- Environment variables missing
- Insufficient memory

**Solution:**
```bash
# Check what's using ports
netstat -tulpn | grep :80
netstat -tulpn | grep :8000

# Verify environment variables
cat .env

# Check available memory
free -h
```

### Issue: Backend Returns 500 Error

**Check backend logs:**
```bash
docker-compose -f docker-compose.prod.yml logs backend
```

**Common causes:**
- Database connection failed
- Missing API keys
- Database not ready

**Solution:**
```bash
# Verify database is running
docker-compose -f docker-compose.prod.yml ps db

# Check database connection
docker exec -it ar_automation_backend_prod curl http://db:5432

# Restart backend
docker-compose -f docker-compose.prod.yml restart backend
```

### Issue: Frontend Shows Blank Page

**Check nginx logs:**
```bash
docker-compose -f docker-compose.prod.yml logs frontend
```

**Common causes:**
- Build failed
- Assets not copied
- Nginx misconfiguration

**Solution:**
```bash
# Rebuild frontend
docker-compose -f docker-compose.prod.yml up -d --build frontend

# Check if files exist in container
docker exec ar_automation_frontend_prod ls /usr/share/nginx/html
```

### Issue: Out of Disk Space

**Check disk usage:**
```bash
df -h
docker system df
```

**Solution:**
```bash
# Clean up Docker
docker system prune -a -f

# Remove old logs
truncate -s 0 /var/log/nginx/access.log
truncate -s 0 /var/log/nginx/error.log

# Remove unused packages
apt autoremove -y
```

### Issue: High Memory Usage

**Check memory:**
```bash
free -h
docker stats
```

**Solution for $6 droplet:**
```bash
# Reduce backend workers in backend/Dockerfile.prod
# Change from --workers 2 to --workers 1

# Rebuild backend
docker-compose -f docker-compose.prod.yml up -d --build backend

# Or upgrade to $12 droplet (2GB RAM)
```

### Issue: Database Connection Refused

**Check database status:**
```bash
docker-compose -f docker-compose.prod.yml ps db
docker-compose -f docker-compose.prod.yml logs db
```

**Solution:**
```bash
# Wait for database to be ready
docker-compose -f docker-compose.prod.yml restart db

# Check health
docker exec ar_automation_db_prod pg_isready -U postgres
```

### Issue: GitHub Actions Fails

**Check workflow logs:**
- Go to GitHub → Actions tab
- Click on failed workflow
- Review error messages

**Common causes:**
- SSH connection failed (wrong IP or key)
- deploy.sh not executable
- Git pull failed

**Solution:**
```bash
# Verify SSH key is added to droplet
cat ~/.ssh/authorized_keys

# Make deploy.sh executable
chmod +x /root/AR_Website_v3/deploy.sh

# Test SSH from local
ssh -i ~/.ssh/github_actions_deploy root@YOUR_DROPLET_IP
```

### Getting Help

- **Documentation:** See `DEPLOYMENT_QUICK_REF.md` for quick commands
- **Docker Logs:** Always check logs first
- **DigitalOcean Community:** https://www.digitalocean.com/community
- **GitHub Issues:** Report bugs in the repository

---

## Next Steps

After successful deployment:

1. **Setup Monitoring:**
   - DigitalOcean Monitoring dashboard
   - Setup uptime monitoring (UptimeRobot, Pingdom)
   - Configure log aggregation (Papertrail, Logtail)

2. **Enable SSL:**
   - Setup Let's Encrypt certificate
   - Configure automatic renewal
   - Update nginx for HTTPS

3. **Improve Performance:**
   - Add Redis for caching
   - Setup CDN for static assets
   - Enable database query optimization

4. **Implement Backups:**
   - Automated database backups
   - DigitalOcean Droplet snapshots
   - Off-site backup storage

5. **Scale Up:**
   - Upgrade to $12 droplet for better performance
   - Move to managed PostgreSQL database
   - Add load balancer for high availability

---

## Cost Breakdown

**Minimum Setup ($6/month):**
- Basic Droplet (1GB RAM): $6/month
- Total: **$6/month**

**Recommended Setup ($21/month):**
- Basic Droplet (1GB RAM): $6/month
- Managed PostgreSQL (1GB RAM): $15/month
- Total: **$21/month**

**Production Setup ($33/month):**
- Droplet (2GB RAM): $12/month
- Managed PostgreSQL: $15/month
- Backups: $1.20/month
- Load Balancer: $12/month (optional)
- Total: **$28-40/month**

---

## Support

For deployment issues or questions:
- Check `DEPLOYMENT_QUICK_REF.md` for quick commands
- Review troubleshooting section above
- Check DigitalOcean documentation
- Open issue in GitHub repository
