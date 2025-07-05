#!/bin/bash

echo "🚀 AI DOB Insights - Gemini API Setup"
echo "====================================="
echo ""

# Check if GEMINI_API_KEY is already set
if [ -n "$GEMINI_API_KEY" ]; then
    echo "✅ Gemini API key is already set in environment"
    echo "   Key: ${GEMINI_API_KEY:0:10}..."
else
    echo "❌ Gemini API key not found in environment"
    echo ""
    echo "To set up Gemini API:"
    echo "1. Visit: https://makersuite.google.com/app/apikey"
    echo "2. Create a new API key"
    echo "3. Set the environment variable:"
    echo ""
    echo "   export GEMINI_API_KEY='your_api_key_here'"
    echo ""
    echo "4. Or add it to your shell profile (~/.bashrc, ~/.zshrc, etc.)"
    echo ""
    echo "Then restart the server with: npm start"
fi

echo ""
echo "Current configuration:"
echo "  - Server URL: http://localhost:3000"
echo "  - API Endpoint: http://localhost:3000/api/process-dob"
echo "  - Environment: ${LM_DEV_MODE:-Gemini}"
echo ""
echo "Test the API:"
echo "  curl 'http://localhost:3000/api/process-dob?dob=1990-01-01&lang=en'"
echo ""

USE_GEMINI=0
LM_STUDIO_URL=http://127.0.0.1:1234 