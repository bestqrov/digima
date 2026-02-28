# 🚀 ArwaPark SaaS Backend - Online Deployment Guide

This guide covers deploying ArwaPark to modern cloud platforms like Coolify, Railway, Render, and Heroku.

## 📋 Quick Start - Online Deployment

Your ArwaPark backend is ready to deploy online! Here's how:

### 1. Update Your MongoDB Connection

Replace the MongoDB URI in `.env.production` with a MongoDB Atlas connection:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/arwapark?retryWrites=true&w=majority&appName=ArwaPark
```

### 2. Deploy to Your Platform

**Coolify** (Recommended):
- Create new project → GitHub import
- Use `Dockerfile.deploy` 
- Add environment variables
- Deploy!

**Railway**:
- Connect GitHub → Import repo
- Auto-detects Dockerfile
- Add environment variables
- Deploy!

**Render/Heroku**:
- Connect repository  
- Set build/start commands
- Add environment variables
- Deploy!

### 3. Test Your Deployment

Once deployed, visit:
- **Health Check**: `https://your-domain.com/health`
- **API Docs**: `https://your-domain.com/api/docs`

## 🔧 Environment Variables Required

```env
NODE_ENV=production
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_ACCESS_SECRET=your-super-secure-access-secret
JWT_REFRESH_SECRET=your-super-secure-refresh-secret
CORS_ORIGINS=*
PORT=3000
```

## 🗄️ MongoDB Atlas Setup (5 minutes)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create free cluster
3. Create database user
4. Add network access (0.0.0.0/0)
5. Get connection string
6. Update MONGODB_URI in your deployment

## ✅ You're Live!

Your ArwaPark SaaS backend will be online with:
- ✅ Multi-tenant architecture
- ✅ JWT authentication  
- ✅ API documentation
- ✅ Health monitoring
- ✅ Production security
   # Edit .env with your production values
   ```

3. **Generate secure secrets:**
   ```bash
   # Generate JWT secrets
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Update production configuration:**
   ```bash
   # Update .env with:
   # - Strong JWT secrets
   # - Production MongoDB URI
   # - Your domain names for CORS
   # - Strong passwords for Redis and MongoDB
   ```

### Deployment Steps

1. **Build and start services:**
   ```bash
   make deploy-prod
   # OR
   docker-compose up -d
   ```

2. **Verify deployment:**
   ```bash
   make health
   # OR
   curl -f http://your-domain.com/api/v1/health
   ```

3. **Monitor logs:**
   ```bash
   make logs
   # OR
   docker-compose logs -f
   ```

### SSL Configuration

1. **Obtain SSL certificates (using Certbot):**
   ```bash
   certbot certonly --webroot -w /var/www/html -d yourdomain.com -d www.yourdomain.com
   ```

2. **Copy certificates:**
   ```bash
   mkdir -p nginx/ssl
   cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/
   cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/
   ```

3. **Update nginx.conf:**
   - Uncomment SSL configuration section
   - Update domain names

### Database Backups

1. **Manual backup:**
   ```bash
   make db-backup
   ```

2. **Scheduled backups (add to crontab):**
   ```bash
   0 2 * * * cd /path/to/arwa-park && make db-backup
   ```

### Monitoring

1. **Check service health:**
   ```bash
   make health
   ```

2. **View logs:**
   ```bash
   make logs-api    # API logs
   make logs-db     # Database logs
   ```

3. **Resource monitoring:**
   ```bash
   docker stats
   ```

### Maintenance

1. **Update application:**
   ```bash
   git pull
   make build-docker
   docker-compose up -d --no-deps arwa-park-api
   ```

2. **Clean up resources:**
   ```bash
   make clean
   ```

3. **Security updates:**
   ```bash
   make update-deps
   ```

### Troubleshooting

1. **Service not starting:**
   ```bash
   docker-compose logs <service-name>
   ```

2. **Database connection issues:**
   - Check MongoDB logs: `make logs-db`
   - Verify MongoDB URI in environment
   - Check network connectivity

3. **High memory usage:**
   ```bash
   docker stats
   # Consider scaling or optimizing services
   ```

### Security Checklist

- [ ] Strong JWT secrets generated
- [ ] Production MongoDB with authentication
- [ ] CORS configured for your domains only
- [ ] SSL certificates installed
- [ ] Regular backups scheduled
- [ ] Dependencies updated
- [ ] Firewall configured
- [ ] Rate limiting enabled

### Coolify Specific
If using Coolify for deployment:

1. Import the project repository
2. Set environment variables in Coolify dashboard
3. Configure domain and SSL in Coolify
4. Deploy using Coolify interface

Coolify will handle the Docker compose deployment automatically.