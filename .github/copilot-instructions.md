# ArwaPark - Tourist Transport Management System

A scalable SaaS backend for tourist transport agencies built with NestJS and MongoDB.

## Features Implemented

✅ Multi-tenant architecture with agency isolation
✅ JWT-based authentication with refresh tokens  
✅ Role-based access control (SUPER_ADMIN, AGENCY_ADMIN, DRIVER)
✅ Complete domain modules: Auth, Agencies, Users
✅ MongoDB schemas with Mongoose ODM
✅ Comprehensive validation with class-validator
✅ Swagger API documentation
✅ Global guards and interceptors for security

## Project Structure

The project follows clean architecture principles with domain-based modules:

- **config/**: Application configuration files
- **common/**: Shared guards, decorators, interceptors
- **shared/**: Enums, interfaces, constants
- **modules/**: Domain-specific modules
  - **auth/**: Authentication and authorization
  - **agencies/**: Agency management
  - **users/**: User management
  - **vehicles/**: Vehicle fleet management (schema ready)
  - **trips/**: Trip scheduling and tracking (schema ready)
  - **billing/**: Invoice and payment management (schema ready)

## Current Implementation Status

### Completed Modules
- ✅ Authentication (login/logout/refresh)
- ✅ Agency management (CRUD operations)
- ✅ User management (CRUD with role-based access)

### Ready for Implementation
- 🔄 Vehicles module (schema and structure created)
- 🔄 Trips module (schema and structure created) 
- 🔄 Billing module (schema and structure created)

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT access tokens (15min expiry)
- Refresh tokens (7 days expiry) with version tracking
- Multi-tenant data isolation
- Role-based permission system
- CORS configuration
- Input validation and sanitization

## Next Steps

To complete the remaining modules:

1. **Vehicles Module**: Implement controllers and services
2. **Trips Module**: Add trip scheduling and tracking logic
3. **Billing Module**: Create invoice generation and payment tracking
4. **Advanced Features**: Real-time notifications, reporting, integrations

The foundation is solid and extensible for future accounting system integration and additional features.