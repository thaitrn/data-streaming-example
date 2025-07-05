const express = require('express');
const cors = require('cors');
const path = require('path');
const processDOB = require('./api/process-dob');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// API Routes
app.get('/api/process-dob', processDOB);

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.USE_GEMINI === '0' ? 'LM Studio' : 'Gemini'}`);
    console.log(`🌍 CORS enabled`);
    console.log(`📁 Static files served from: ${__dirname}`);
}); 