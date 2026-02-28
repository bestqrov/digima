# 🎯 ArwaPark Demo Agency Setup

## 📊 Demo Data Created

A complete demo agency has been successfully created with the following setup:

### 📋 Demo Plan
- **Name**: Demo Plan
- **Price**: $0/month (Free)
- **Limits**: 
  - 5 vehicles maximum
  - 5 drivers maximum 
  - 50 trips per month
- **Features**: Full system access for testing

### 🏢 Demo Agency
- **Name**: ArwaPark Demo Agency
- **Email**: demo@arwapark.com
- **Status**: Demo (30-day trial)
- **Demo Expires**: March 30, 2026

### 👥 Demo Users

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **Super Admin** | admin@arwapark.com | demo123456 | Full system access, all agencies |
| **Agency Admin** | agency@arwapark.com | demo123456 | Agency management, users, vehicles, trips |
| **Driver** | driver@arwapark.com | demo123456 | Basic operations, trip management |

## 🚀 How to Test

### 1. **API Testing**
```bash
# Test login with any demo user
curl -X POST https://arwapark.digima.cloud/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "admin@arwapark.com",
    "password": "demo123456"
  }'
```

### 2. **Frontend Testing**
```bash
# Start the frontend (from frontend directory)
cd frontend
npm install
npm run dev

# Access at: http://localhost:3000
# Login with any demo user credentials
```

### 3. **API Documentation**
- Visit: https://arwapark.digima.cloud/api/docs
- Use demo credentials to test authenticated endpoints

## 🎮 Demo Scenarios

### **Scenario 1: Super Admin**
Login as `admin@arwapark.com` to:
- View all agencies in the system
- Manage system-wide settings
- Access admin-only features

### **Scenario 2: Agency Admin**
Login as `agency@arwapark.com` to:
- Manage the demo agency
- Add/remove users and drivers
- Create and manage vehicles
- Book and track trips
- View agency statistics

### **Scenario 3: Driver**
Login as `driver@arwapark.com` to:
- View assigned trips
- Update trip status
- Manage basic profile

## 🔄 Reset Demo Data

To recreate the demo data:

```bash
# From the main project directory
npm run seed:demo
```

**Note**: This will recreate users if they don't exist, but won't duplicate existing ones.

## 🛠️ Extending Demo Data

You can modify the demo script at `scripts/create-demo-agency.ts` to:
- Add more demo users
- Create sample vehicles
- Add sample trips
- Customize agency settings

## 📝 Next Steps

1. **Test Authentication**: Login with different user roles
2. **Explore Features**: Try creating vehicles, trips, and managing users
3. **API Integration**: Test API endpoints with the demo data
4. **Frontend Development**: Use demo data for frontend development
5. **Customization**: Modify the demo script for your specific testing needs

## 🔗 Quick Links

- **Backend API**: https://arwapark.digima.cloud/api
- **API Documentation**: https://arwapark.digima.cloud/api/docs
- **Frontend Setup**: [frontend/README.md](../frontend/README.md)
- **Demo Script**: [scripts/create-demo-agency.ts](../scripts/create-demo-agency.ts)

---

**Happy Testing! 🎉**