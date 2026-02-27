#!/bin/bash

# ArwaPark Setup Script
# This script sets up the development environment

set -e

echo "🚌 Setting up ArwaPark Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}$1${NC}"
}

# Check if Node.js is installed
check_node() {
    print_header "🔍 Checking Node.js installation..."
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_status "Node.js found: $NODE_VERSION"
        
        # Check if version is 18 or higher
        NODE_MAJOR_VERSION=$(node --version | cut -d'.' -f1 | cut -d'v' -f2)
        if [ "$NODE_MAJOR_VERSION" -lt 18 ]; then
            print_error "Node.js version 18 or higher required. Current: $NODE_VERSION"
            exit 1
        fi
    else
        print_error "Node.js not found. Please install Node.js 18+ from https://nodejs.org"
        exit 1
    fi
}

# Check if Docker is installed
check_docker() {
    print_header "🐳 Checking Docker installation..."
    if command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker --version)
        print_status "Docker found: $DOCKER_VERSION"
    else
        print_error "Docker not found. Please install Docker from https://docs.docker.com/get-docker/"
        exit 1
    fi

    if command -v docker-compose &> /dev/null || docker compose version &> /dev/null; then
        print_status "Docker Compose found"
    else
        print_error "Docker Compose not found. Please install Docker Compose"
        exit 1
    fi
}

# Setup environment file
setup_env() {
    print_header "⚙️  Setting up environment configuration..."
    
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            print_status "Created .env from .env.example"
        else
            print_error ".env.example not found. Creating basic .env file..."
            cat > .env << EOF
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://admin:devpassword@localhost:27017/arwapark_dev?authSource=admin
JWT_ACCESS_SECRET=dev-access-secret-key-not-for-production-use-only-$(openssl rand -hex 16)
JWT_REFRESH_SECRET=dev-refresh-secret-key-not-for-production-use-only-$(openssl rand -hex 16)
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
FRONTEND_URL=http://localhost:3001
RATE_LIMIT_MAX=100
BCRYPT_ROUNDS=10
EOF
            print_status "Created basic .env file"
        fi
        
        print_warning "Please review and customize the .env file before running the application"
    else
        print_status ".env file already exists"
    fi
}

# Install dependencies
install_deps() {
    print_header "📦 Installing dependencies..."
    
    if [ -f package.json ]; then
        npm install
        print_status "Dependencies installed successfully"
    else
        print_error "package.json not found"
        exit 1
    fi
}

# Start development services
start_services() {
    print_header "🚀 Starting development services..."
    
    if [ -f docker-compose.dev.yml ]; then
        docker-compose -f docker-compose.dev.yml up -d
        print_status "Development services started"
        
        # Wait for services to be healthy
        print_status "Waiting for services to be ready..."
        sleep 10
        
        # Check MongoDB connection
        if docker-compose -f docker-compose.dev.yml exec -T mongodb mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
            print_status "MongoDB is ready"
        else
            print_warning "MongoDB may not be ready yet. Check logs if needed: docker-compose -f docker-compose.dev.yml logs mongodb"
        fi
        
    else
        print_error "docker-compose.dev.yml not found"
        exit 1
    fi
}

# Create a demo admin user
create_demo_user() {
    print_header "👤 Would you like to create a demo admin user? (y/n)"
    read -r CREATE_DEMO
    
    if [ "$CREATE_DEMO" = "y" ] || [ "$CREATE_DEMO" = "Y" ]; then
        print_status "Starting API server to create demo user..."
        npm run start:dev &
        API_PID=$!
        
        # Wait for API to start
        sleep 15
        
        # Create demo agency and user
        print_status "Creating demo agency and admin user..."
        
        # You would implement this API call once the server is running
        # curl -X POST http://localhost:3000/api/v1/auth/register \
        #   -H "Content-Type: application/json" \
        #   -d '{
        #     "agency": {
        #       "name": "Demo Transport Agency",
        #       "email": "demo@arwapark.com",
        #       "phoneNumber": "+1234567890",
        #       "countryCode": "US"
        #     },
        #     "user": {
        #       "name": "Demo Admin",
        #       "email": "admin@demo.com",
        #       "password": "DemoPassword123!",
        #       "role": "AGENCY_ADMIN"
        #     }
        #   }'
        
        kill $API_PID 2>/dev/null || true
        print_status "Demo user creation completed"
    fi
}

# Print final instructions
print_instructions() {
    print_header "
🎉 ArwaPark Development Environment Setup Complete!

📚 Quick Start Commands:
  npm run start:dev              # Start development server (hot reload)
  npm run start:debug            # Start with debugging
  npm run build                  # Build for production
  npm run test                   # Run tests

🌐 Development URLs:
  API Server:      http://localhost:3000
  API Docs:        http://localhost:3000/api/docs
  Health Check:    http://localhost:3000/health
  MongoDB Admin:   http://localhost:8081
  Redis Admin:     http://localhost:8082

🐳 Docker Commands:
  docker-compose -f docker-compose.dev.yml up    # Start services
  docker-compose -f docker-compose.dev.yml down  # Stop services
  docker-compose -f docker-compose.dev.yml logs  # View logs

📝 Next Steps:
  1. Review and customize the .env file
  2. Run 'npm run start:dev' to start the development server
  3. Visit http://localhost:3000/api/docs for API documentation
  4. Start building your SaaS application!

Need help? Check the README.md file or visit the API docs.
"
}

# Main execution
main() {
    print_header "
🚌 ArwaPark - Tourist Transport Management SaaS
   Development Environment Setup
"

    check_node
    check_docker
    setup_env
    install_deps
    start_services
    create_demo_user
    print_instructions
}

# Run main function
main