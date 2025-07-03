const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const app = express();
const port = 3000;

// Configure OpenAI API
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Store API key in environment variable
    baseURL: 'https://api.openai.com/v1',
});

app.use(cors());
app.use(express.json());

// Endpoint to process date of birth with OpenAI API streaming
app.get('/process-dob/:dob', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const dob = req.params.dob;
    if (!isValidDate(dob)) {
        res.write('data: {"error": "Invalid date format"}\n\n');
        res.end();
        return;
    }

    try {
        const stream = await client.chat.completions.create({
            model: 'gpt-4o-mini', // Use a streaming-compatible model
            messages: [
                {
                    role: 'system',
                    content: 'You are an AI that analyzes dates of birth. Given a date of birth, calculate the age, determine the zodiac sign, and provide a brief personality insight based on the zodiac sign. Respond in short, streamable chunks.'
                },
                {
                    role: 'user',
                    content: `Analyze this date of birth: ${dob}`
                }
            ],
            stream: true,
        });

        for await (const chunk of stream) {
            const message = chunk.choices[0]?.delta?.content || '';
            if (message) {
                res.write(`data: ${JSON.stringify({ message })}\n\n`);
            }
        }
        res.end();
    } catch (error) {
        let errorMessage = error.message;
        if (error.response?.status === 403 || error.code === 'insufficient_quota') {
            errorMessage = 'API access denied: Insufficient quota. Please check your OpenAI account at https://platform.openai.com/account/billing';
        }
        res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
        res.end();
    }
});

// Validate date format
function isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});