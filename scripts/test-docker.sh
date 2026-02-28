#!/bin/bash

# Docker Build Test Script for ArwaPark SaaS

set -e

echo "🚀 Testing ArwaPark Docker Build..."

# Clean up any existing containers
echo "🧹 Cleaning up existing containers..."
docker rm -f arwapark-test 2>/dev/null || true

# Build the Docker image
echo "🔧 Building Docker image..."
docker build -t arwapark-test .

# Run the container in background
echo "🏃 Starting test container..."
docker run -d -p 3001:3000 --name arwapark-test arwapark-test

# Wait for container to start
echo "⏳ Waiting for container to start..."
sleep 10

# Test the endpoints
echo "🔍 Testing endpoints..."

# Test health endpoint
echo "Testing health endpoint..."
health_response=$(curl -s http://localhost:3001/health | jq -r '.status' 2>/dev/null || echo "failed")
if [ "$health_response" = "ok" ]; then
    echo "✅ Health endpoint working"
else
    echo "❌ Health endpoint failed"
fi

# Test root endpoint (landing page)
echo "Testing landing page..."
if curl -s http://localhost:3001/ | grep -q "ArwaPark"; then
    echo "✅ Landing page working"
else
    echo "❌ Landing page failed"
fi

# Test login endpoint
echo "Testing login page..."
if curl -s http://localhost:3001/login | grep -q "Sign in to ArwaPark"; then
    echo "✅ Login page working"
else
    echo "❌ Login page failed"
fi

# Show container logs
echo "📋 Container logs:"
docker logs arwapark-test | tail -10

# Cleanup
echo "🧹 Cleaning up..."
docker rm -f arwapark-test

echo "🎉 Docker test complete!"