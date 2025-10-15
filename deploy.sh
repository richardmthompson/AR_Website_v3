#!/bin/bash
set -e

echo "======================================"
echo "  AR Automation Deployment Script"
echo "======================================"
echo ""

# Pull latest code
echo "[1/5] Pulling latest code from main branch..."
git pull origin main
echo "✓ Code updated"
echo ""

# Stop existing containers
echo "[2/5] Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down
echo "✓ Containers stopped"
echo ""

# Remove old images to free space
echo "[3/5] Cleaning up old Docker images..."
docker system prune -f
echo "✓ Cleanup complete"
echo ""

# Build and start new containers
echo "[4/5] Building and starting new containers..."
docker-compose -f docker-compose.prod.yml up -d --build
echo "✓ Containers started"
echo ""

# Wait for services to be healthy
echo "[5/5] Waiting for services to start..."
sleep 10

# Check health
echo ""
echo "Service status:"
docker-compose -f docker-compose.prod.yml ps
echo ""

# Check backend health endpoint
echo "Checking backend health..."
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✓ Backend is healthy"
else
    echo "⚠ Backend health check failed"
fi
echo ""

echo "======================================"
echo "  Deployment Complete!"
echo "======================================"
echo ""
echo "Access your application:"
echo "  Frontend: http://YOUR_DROPLET_IP"
echo "  Backend API: http://YOUR_DROPLET_IP:8000"
echo "  Backend Health: http://YOUR_DROPLET_IP:8000/health"
echo ""
echo "To view logs:"
echo "  docker-compose -f docker-compose.prod.yml logs -f"
echo ""
