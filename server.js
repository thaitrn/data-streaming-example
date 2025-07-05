const express = require('express');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(compression());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Import refactored API handler
const { createProcessDOBHandler } = require('./src/api/process-dob');

// Create handler instance
const processDOBHandler = createProcessDOBHandler({
  config: {
    aiConfig: {
      apiKey: process.env.GEMINI_API_KEY,
      baseUrl: process.env.LM_STUDIO_URL || 'http://localhost:1234',
      model: process.env.LM_MODEL || 'local-model'
    },
    promptConfig: {
      lang: 'vi',
      includeExamples: true,
      maxLength: 2000
    }
  }
});

// API Routes
app.get('/api/process-dob', async (req, res) => {
  try {
    await processDOBHandler.handle({ req, res });
  } catch (error) {
    console.error('Error in process-dob endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 🔄 5. Feedback Mechanisms - New endpoint
app.post('/api/feedback', (req, res) => {
  try {
    const { type, timestamp, language, userAgent, details } = req.body;
    
    // Log feedback for analysis
    console.log('[FEEDBACK]', {
      type,
      timestamp,
      language,
      userAgent: userAgent?.substring(0, 100), // Truncate for privacy
      details: details?.substring(0, 500) // Limit length
    });
    
    // In production, save to database
    // await saveFeedback({ type, timestamp, language, details });
    
    res.json({ 
      success: true, 
      message: 'Thank you for your feedback!' 
    });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    features: {
      streaming: true,
      voiceInput: true,
      feedback: true,
      multiLanguage: true
    }
  });
});

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🤖 AI Provider: ${process.env.USE_GEMINI === '1' ? 'Gemini' : 'LM Studio'}`);
  console.log(`🎯 Features: Streaming, Voice Input, Feedback, Multi-language`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
}); 