#!/bin/sh
echo "Starting Next.js frontend on port 3001..."
(cd /app/frontend && PORT=3001 HOSTNAME=127.0.0.1 node server.js) &
echo "Starting NestJS backend on port 3000..."
FRONTEND_PROXY=true exec node /app/dist/src/main.js
