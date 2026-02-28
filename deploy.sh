#!/bin/bash

# ArwaPark Production Deployment Script
# Run this script on your production server

set -e

echo "🚀 Starting ArwaPark Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    echo "Run: curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Set Docker Compose command (support both old and new syntax)
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    DOCKER_COMPOSE="docker compose"
fi

echo -e "${GREEN}✅ Docker and Docker Compose are available${NC}"

# Set environment variables
export MONGO_ROOT_PASSWORD="ArwaPark2026MongoDBRootPasswordProd5hJ8kM1nQ4tW7z"
export REDIS_PASSWORD="ArwaPark2026RedisPasswordProd7kM4nQ1tW8zG"

echo -e "${YELLOW}🔧 Setting up environment variables...${NC}"

# Stop existing containers if running
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
$DOCKER_COMPOSE -f docker-compose.prod.yml down || true

# Pull latest changes (if this is a git repo)
if [ -d ".git" ]; then
    echo -e "${YELLOW}📥 Pulling latest changes...${NC}"
    git pull || echo "Not in a git repository or no remote configured"
fi

# Build and start services
echo -e "${YELLOW}🔨 Building and starting services...${NC}"
$DOCKER_COMPOSE -f docker-compose.prod.yml up --build -d

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 30

# Check service status
echo -e "${GREEN}📊 Service Status:${NC}"
$DOCKER_COMPOSE -f docker-compose.prod.yml ps

# Test endpoints
echo -e "${YELLOW}🧪 Testing endpoints...${NC}"

# Test nginx health
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Nginx health check passed${NC}"
else
    echo -e "${RED}❌ Nginx health check failed${NC}"
fi

# Test frontend
if curl -f http://localhost/ > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is responding${NC}"
else
    echo -e "${RED}❌ Frontend is not responding${NC}"
fi

# Test API
if curl -f http://localhost/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API health check passed${NC}"
else
    echo -e "${RED}❌ API health check failed${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Deployment completed!${NC}"
echo -e "${GREEN}📱 Your ArwaPark application is now available at:${NC}"
echo -e "${GREEN}   🌐 Frontend: http://your-domain.com${NC}"
echo -e "${GREEN}   🔌 API: http://your-domain.com/api${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Configure your DNS to point to this server"
echo "2. Set up SSL certificates for HTTPS"
echo "3. Update firewall rules if needed"
echo ""
echo -e "${YELLOW}📱 To view logs:${NC}"
echo "$DOCKER_COMPOSE -f docker-compose.prod.yml logs -f"
echo ""
echo -e "${YELLOW}🔄 To restart services:${NC}"
echo "$DOCKER_COMPOSE -f docker-compose.prod.yml restart"