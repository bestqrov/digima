# ArwaPark SaaS Frontend

A modern, production-ready Next.js 14 frontend for the ArwaPark multi-tenant tourist transport platform.

## 🚀 Features

- **Modern Stack**: Next.js 14 with App Router, TypeScript, TailwindCSS
- **Authentication**: JWT-based authentication with protected routes
- **State Management**: Zustand for efficient state management
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Professional SaaS design with Heroicons and Headless UI
- **Multi-tenant**: Role-based access control (Super Admin, Agency Admin, Agency User)
- **Responsive**: Mobile-first design with modern UI/UX

## 🏗️ Architecture

### Core Modules
- **Dashboard**: Overview with statistics and quick actions
- **Authentication**: Login/logout with role-based access
- **Subscription Management**: Plan management and billing
- **Vehicle Management**: CRUD operations for fleet management
- **Trip Management**: Booking and status tracking
- **User Management**: Team member management with role permissions

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom design system
- **State**: Zustand with immer for immutable updates
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors
- **Icons**: Heroicons + Lucide React
- **UI Components**: Headless UI for accessible components
- **Notifications**: React Hot Toast

## 📦 Installation

1. **Clone and navigate to frontend directory**
   ```bash
   cd arwa-park/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment**
   ```bash
   cp .env.local.example .env.local
   ```
   Update the environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=https://arwapark.digima.cloud/api
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Available Scripts

- **`npm run dev`** - Start development server
- **`npm run build`** - Build for production
- **`npm run start`** - Start production server
- **`npm run lint`** - Run ESLint
- **`npm run type-check`** - Run TypeScript type checking

## 🎨 Project Structure

```
frontend/
├── app/                    # Next.js 14 App Router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard and main app
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable UI components
│   ├── EmptyState.tsx
│   ├── ErrorState.tsx
│   ├── LoadingSpinner.tsx
│   ├── LoadingSkeleton.tsx
│   ├── ProtectedRoute.tsx
│   ├── Sidebar.tsx
│   └── Topbar.tsx
├── lib/                   # Utility functions
│   └── utils.ts
├── services/             # API services
│   ├── api.ts            # Main API client
│   ├── authService.ts
│   ├── agencyService.ts
│   ├── subscriptionService.ts
│   ├── vehicleService.ts
│   ├── tripService.ts
│   └── userService.ts
├── store/                # Zustand state management
│   ├── authStore.ts
│   ├── subscriptionStore.ts
│   ├── vehicleStore.ts
│   ├── tripStore.ts
│   ├── userStore.ts
│   └── index.ts
└── types/                # TypeScript definitions
    ├── auth.ts
    ├── subscription.ts
    ├── api.ts
    ├── vehicle.ts
    ├── trip.ts
    ├── user.ts
    ├── agency.ts
    └── index.ts
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://arwapark.digima.cloud/api` |
| `NEXT_PUBLIC_BASE_URL` | Frontend base URL | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `ArwaPark SaaS` |
| `NEXT_PUBLIC_DEV_MODE` | Development mode | `true` |
| `NEXT_PUBLIC_LOG_LEVEL` | Logging level | `info` |

### TailwindCSS Design System

Custom design tokens defined in `tailwind.config.js`:
- **Primary Colors**: Blue-based palette for main actions
- **Success/Warning/Error**: Semantic color system
- **Typography**: Responsive font scales
- **Spacing**: Consistent spacing system
- **Components**: Card, button, form, and navigation styles

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

### Docker Deployment
```bash
docker build -t arwapark-frontend .
docker run -p 3000:3000 arwapark-frontend
```

### Platform Deployment (Vercel, Netlify, etc.)
1. Connect your repository
2. Set environment variables
3. Build command: `npm run build`
4. Output directory: `.next`

## 🔐 Authentication & Security

- **JWT Tokens**: Stored in httpOnly cookies
- **Route Protection**: Middleware-based route guards
- **Role-based Access**: Three user levels with different permissions
- **API Security**: Request/response interceptors with token management
- **CSRF Protection**: SameSite cookies and CSRF tokens

## 📱 Features by Role

### Super Admin
- Full system access
- All agency management
- User management across agencies
- System-wide statistics

### Agency Admin
- Agency-specific access
- Manage agency users
- Vehicle and trip management
- Subscription management

### Agency User
- Read-only dashboard access
- Basic vehicle and trip operations
- Limited user profile management

## 🐛 Development

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for pre-commit hooks (optional)

### Testing
```bash
# Type checking
npm run type-check

# Linting
npm run lint
```

## 🔄 API Integration

The frontend integrates with the ArwaPark NestJS backend:
- **Base URL**: `https://arwapark.digima.cloud/api`
- **Authentication**: JWT tokens with refresh mechanism
- **Error Handling**: Centralized error management with toast notifications
- **Loading States**: Consistent loading UI across all modules

## 📞 Support

For technical support or deployment issues, refer to the main project documentation or contact the development team.

## 🚀 Ready for Production

This frontend is production-ready with:
- ✅ TypeScript type safety
- ✅ Modern React patterns
- ✅ Responsive design
- ✅ Performance optimized
- ✅ Security best practices
- ✅ Error handling
- ✅ Loading states
- ✅ Form validation
- ✅ State management
- ✅ API integration