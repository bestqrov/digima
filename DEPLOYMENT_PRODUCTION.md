# ArwaPark Production Deployment Guide

This guide will help you deploy your ArwaPark application to a live server using Docker.

## Prerequisites

- A VPS or cloud server (Ubuntu/Debian recommended)
- Docker and Docker Compose installed
- Domain pointing to your server (arwapark.digima.cloud)
- SSL certificates (optional but recommended)

## Quick Deployment Steps

### 1. Server Setup

```bash
# Update your server
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add your user to docker group
sudo usermod -aG docker $USER
```

### 2. Deploy Application

```bash
# Clone your repository
git clone <your-repo-url>
cd arwa-park

# Set environment variables for Docker
export MONGO_ROOT_PASSWORD="ArwaPark2026!MongoDB\$Root#Password@Prod*5hJ8kM1nQ4tW7z"
export REDIS_PASSWORD="your-redis-password-here"

# Build and start services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps
```

### 3. Local Testing (Alternative)

If you want to test the production setup locally first:

```bash
# Build and run production setup locally
docker-compose -f docker-compose.prod.yml up --build

# Your app will be available at:
# - Frontend: http://localhost (via nginx)
# - API: http://localhost/api
# - Direct backend: http://localhost:3000
# - Direct frontend: http://localhost:3001
```

## Services Overview

- **Frontend**: Next.js application with login form at root
- **Backend**: NestJS API with MongoDB and Redis
- **Nginx**: Reverse proxy handling routing
- **MongoDB**: Database with Atlas cloud connection
- **Redis**: Caching and sessions

## Environment Configuration

Your production environment is configured with:
- **Domain**: arwapark.digima.cloud
- **Database**: MongoDB Atlas (already configured)
- **Frontend**: React login form as homepage
- **API**: Full parking management platform

## Monitoring

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check specific service
docker-compose -f docker-compose.prod.yml logs frontend
docker-compose -f docker-compose.prod.yml logs arwapark-api

# Restart services
docker-compose -f docker-compose.prod.yml restart
```

## SSL Setup (Recommended)

For production with SSL:

1. Get SSL certificates (Let's Encrypt recommended)
2. Place certificates in `./ssl/` directory
3. Uncomment HTTPS server block in nginx.conf
4. Update nginx ports in docker-compose.prod.yml

## Troubleshooting

- **Container not starting**: Check `docker-compose logs [service-name]`
- **Database connection**: Verify MongoDB Atlas credentials
- **Frontend not loading**: Ensure nginx is routing correctly
- **API errors**: Check backend logs and environment variables

Your login form will be the first page users see at https://arwapark.digima.cloud!