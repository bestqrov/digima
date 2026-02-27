# ArwaPark - Tourist Transport Management SaaS

ArwaPark is a production-ready, scalable SaaS backend for tourist transport agencies, built with NestJS, MongoDB, and implementing secure multi-tenant architecture.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication with access and refresh tokens
- Role-based access control (SUPER_ADMIN, AGENCY_ADMIN, DRIVER)
- Multi-tenant architecture with agency isolation
- Secure password hashing with bcrypt

### 🏢 Core Modules
- **Agencies**: Manage transport agencies with subscription plans
- **Users**: User management with role-based permissions
- **Vehicles**: Vehicle fleet management
- **Trips**: Trip scheduling and tracking
- **Billing**: Invoice and payment management

### 🏗️ Architecture 
- Clean architecture with domain-based modules
- Mongoose ODM for MongoDB with optimized indexes
- Comprehensive validation with class-validator
- Swagger API documentation (dev only)
- Global guards and interceptors for security
- Docker containerization for easy deployment
- Production-ready with health checks and monitoring

### 🔒 Production Security
- Helmet for security headers
- Rate limiting with configurable thresholds
- CORS protection with environment-specific origins
- Data validation and sanitization
- Graceful shutdown handling
- Comprehensive error handling

## Tech Stack

- **Backend**: NestJS (Node.js framework)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with Passport
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, bcrypt, rate limiting
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx (production)
- **Cache**: Redis (optional)

## Getting Started

### Prerequisites
- Node.js (v18 or higher) 
- Docker & Docker Compose
- MongoDB (local, cloud, or Docker)

### Quick Setup (Recommended)

1. **Clone and setup:**
```bash
git clone <repository-url>
cd arwa-park
make setup
```

2. **Start development:**
```bash
make dev
```

### Manual Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Environment configuration:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start development database:**
```bash
make dev-db
```

4. **Start development server:**
```bash
npm run start:dev
```

### Docker Development

1. **Development with Docker:**
```bash
docker-compose -f docker-compose.dev.yml up -d
npm run start:dev
```

2. **Full production simulation:**
```bash
docker-compose up -d
```

**Endpoints:**
- API: `http://localhost:3000` 
- Health: `http://localhost:3000/health`
- Docs: `http://localhost:3000/api/docs` (dev only)

## Production Deployment

### Environment Setup

1. **Production environment:**
```bash
cp .env.production .env
# Update with your production values
```

2. **Generate secure secrets:**
```bash
# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. **Deploy:**
```bash
make deploy-prod
```

### Available Commands

```bash
# Development
make dev              # Start development server
make dev-db          # Start only development database
make dev-stop        # Stop development services

# Production  
make start           # Start production services
make stop            # Stop all services
make restart         # Restart services
make health          # Check service health
make logs            # View logs

# Maintenance
make clean           # Clean Docker resources
make db-backup       # Backup database
make update-deps     # Update dependencies
```

For detailed production deployment on Coolify VPS, see [DEPLOYMENT.md](DEPLOYMENT.md).

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout

### Agencies (Super Admin only)
- `GET /api/v1/agencies` - List all agencies
- `POST /api/v1/agencies` - Create agency
- `PATCH /api/v1/agencies/:id` - Update agency

### Users
- `GET /api/v1/users` - List users (filtered by agency)
- `POST /api/v1/users` - Create user
- `PATCH /api/v1/users/:id` - Update user

## Multi-Tenancy

Each request is automatically filtered by the user's agency context:
- All entities contain `agencyId` field
- Tenant interceptor ensures data isolation
- Agency guard prevents cross-tenant access

## Role-Based Permissions

### SUPER_ADMIN
- Full system access
- Manage all agencies
- Access all data across tenants

### AGENCY_ADMIN  
- Manage their agency's data
- Create/manage users within agency
- Access all agency resources

### DRIVER
- Limited access to assigned trips
- View vehicle assignments
- Update trip status

## Development

### Available Scripts
```bash
# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Testing
npm run test
npm run test:watch
npm run test:e2e

# Linting
npm run lint
npm run format
```

### Project Structure
```
src/
├── config/           # Environment & configuration files
├── common/           # Shared guards, decorators, interceptors
│   ├── guards/       # JWT auth, roles, agency guards
│   ├── decorators/   # Current user, agency ID decorators
│   └── interceptors/ # Tenant isolation interceptor
├── shared/           # Enums, interfaces, constants  
│   ├── enums/        # Trip status, user roles, etc.
│   └── interfaces/   # Base entity, JWT interfaces
└── modules/          # Domain modules
    ├── auth/         # Authentication & authorization
    ├── agencies/     # Agency management
    ├── users/        # User management
    ├── vehicles/     # Vehicle fleet management
    ├── trips/        # Trip scheduling & tracking
    └── billing/      # Invoice & payment processing

# Production files
├── Dockerfile        # Production container
├── docker-compose.yml # Production deployment
├── docker-compose.dev.yml # Development setup
├── nginx/            # Nginx reverse proxy config
├── scripts/          # Database initialization scripts
├── Makefile          # Development & deployment commands
└── DEPLOYMENT.md     # Production deployment guide
```

## Docker & Production

### Development with Docker
```bash
# Start development database
make dev-db

# Run app locally with Docker DB
npm run start:dev
```

### Production Deployment
```bash
# Build production image
make build-docker

# Deploy to production
make deploy-prod

# Monitor services
make health
make logs
```

### Container Features
- Multi-stage Docker build for optimized images  
- Health checks for all services
- Non-root user for security
- Volume mounts for data persistence
- Network isolation
- Nginx reverse proxy with rate limiting

## Security Features

- **Helmet**: Security headers (XSS, CSRF, etc.)
- **Rate Limiting**: Configurable request throttling
- **CORS**: Environment-specific origin control
- **JWT Security**: Secure token generation and validation
- **Password Security**: bcrypt hashing with configurable rounds
- **Input Validation**: Comprehensive request validation
- **Multi-tenant Isolation**: Automatic data segregation
- **Docker Security**: Non-root container execution

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the UNLICENSED License.
# digima
# digima
