#!/bin/bash

# Validation script to check if the build output is correct
echo "🔍 Validating ArwaPark build output..."

# Check if source exists
if [ ! -f "src/main.ts" ]; then
    echo "❌ Source file src/main.ts not found!"
    exit 1
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

echo ""
echo "🐳 Your Docker containers should now start successfully!"
echo "The CMD path has been fixed to: node dist/src/main.js"