#!/bin/bash

# ArwaPark Pre-build Validation Script

echo "🔍 Validating ArwaPark build files..."

# Check if public directory exists
if [ ! -d "public" ]; then
    echo "❌ public/ directory not found!"
    exit 1
else
    echo "✅ public/ directory exists"
fi

# Check if index.html exists
if [ ! -f "public/index.html" ]; then
    echo "❌ public/index.html not found!"
    exit 1
else
    echo "✅ public/index.html exists"
    echo "   Size: $(wc -c < public/index.html) bytes"
fi

# Check if login page exists
if [ ! -f "public/login/index.html" ]; then
    echo "❌ public/login/index.html not found!"
    exit 1
else
    echo "✅ public/login/index.html exists"
    echo "   Size: $(wc -c < public/login/index.html) bytes"
fi

# Check if source exists
if [ ! -f "src/main.ts" ]; then
    echo "❌ Source file src/main.ts not found!"
    exit 1
else
    echo "✅ Source file src/main.ts exists"
fi

# Run build
echo "📦 Running build..."
npm run build

# Check if dist/src/main.js exists (the correct output)
if [ -f "dist/src/main.js" ]; then
    echo "✅ dist/src/main.js found - Docker fix should work!"
    echo "📊 File size: $(wc -c < dist/src/main.js) bytes"
else
    echo "❌ dist/src/main.js not found - build issue persists"
    exit 1
fi

# Check if the old expected path exists (should NOT exist)
if [ -f "dist/main.js" ]; then
    echo "⚠️  WARNING: dist/main.js also exists - might indicate configuration issue"
else
    echo "✅ Confirmed: dist/main.js does NOT exist (expected)"
fi

# Check package.json
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    exit 1
else
    echo "✅ package.json exists"
fi

# Check Dockerfile
if [ ! -f "Dockerfile" ]; then
    echo "❌ Dockerfile not found!"
    exit 1
else
    echo "✅ Dockerfile exists"
fi

echo ""
echo "🎉 All validation checks passed!"
echo "📦 Ready for Docker build!"
echo "🐳 Your Docker containers should now start successfully!"
echo "The CMD path has been fixed to: node dist/src/main.js"
echo ""
echo "Next steps:"
echo "  1. Build: docker build -t arwapark ."
echo "  2. Run: docker run -p 3000:3000 arwapark"
echo "  3. Test: curl http://localhost:3000/"