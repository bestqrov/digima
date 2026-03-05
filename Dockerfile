# =============================================
# Stage 1: Build Next.js Frontend
# =============================================
FROM node:18-alpine AS frontend-builder

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci && npm cache clean --force
COPY frontend/ .

ARG NEXT_PUBLIC_API_URL=https://arwapark.digima.cloud/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

# =============================================
# Stage 2: Build NestJS Backend
# =============================================
FROM node:18-alpine AS backend-builder

WORKDIR /app

RUN apk add --no-cache python3 make g++
COPY package*.json .npmrc ./
RUN npm ci && npm cache clean --force
COPY . .
RUN npm run build

# =============================================
# Stage 3: Production Image
# =============================================
FROM node:18-alpine AS production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S appuser -u 1001
RUN apk add --no-cache curl

WORKDIR /app

COPY package*.json .npmrc ./
RUN npm ci --only=production && npm cache clean --force

# NestJS compiled output
COPY --from=backend-builder --chown=appuser:nodejs /app/dist ./dist

# Next.js standalone server + static assets
COPY --from=frontend-builder --chown=appuser:nodejs /app/.next/standalone ./frontend/
COPY --from=frontend-builder --chown=appuser:nodejs /app/.next/static ./frontend/.next/static
RUN mkdir -p ./frontend/public && chown appuser:nodejs ./frontend/public

COPY start.sh ./
RUN chmod +x start.sh && chown appuser:nodejs start.sh

RUN mkdir -p logs && chown appuser:nodejs logs && chown appuser:nodejs frontend

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["./start.sh"]