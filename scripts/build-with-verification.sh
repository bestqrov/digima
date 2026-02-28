#!/bin/bash

# Build script with comprehensive error checking
set -e

echo "Starting build process..."

# Check if source files exist
if [ ! -f "src/main.ts" ]; then
    echo "ERROR: src/main.ts not found!"
    exit 1
fi

echo "Source files found, proceeding with build..."

# Clean previous build
rm -rf dist/

# Run the build with verbose output
echo "Running NestJS build..."
npx nest build --verbose

# Verify build output
if [ ! -d "dist" ]; then
    echo "ERROR: dist directory was not created!"
    exit 1
fi

if [ ! -f "dist/main.js" ]; then
    echo "ERROR: dist/main.js was not created!"
    echo "Contents of dist directory:"
    ls -la dist/
    exit 1
fi

echo "Build completed successfully!"
echo "Build artifacts:"
ls -la dist/