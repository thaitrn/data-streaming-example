#!/bin/bash

# AI DOB Streaming App Startup Script
echo "🚀 Starting AI DOB Streaming App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your configuration"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check environment configuration
echo "🔧 Checking environment configuration..."

if [ "$USE_GEMINI" = "1" ]; then
    if [ -z "$GEMINI_API_KEY" ]; then
        echo "⚠️  Warning: USE_GEMINI=1 but GEMINI_API_KEY is not set"
        echo "   Please add your Gemini API key to .env file"
    else
        echo "✅ Using Gemini AI provider"
    fi
else
    echo "✅ Using LM Studio AI provider"
    echo "   Make sure LM Studio is running on http://localhost:1234"
fi

# Start the server
echo "🌐 Starting server..."
echo "📊 Health check will be available at: http://localhost:${PORT:-3000}/api/health"
echo "🎯 Main app will be available at: http://localhost:${PORT:-3000}"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start in development mode
npm run dev 