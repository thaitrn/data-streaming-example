const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const app = express();
const port = 3000;

// Cấu hình xAI API
const client = new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: 'https://api.x.ai/v1',
});

app.use(cors());
app.use(express.json());

// Endpoint xử lý ngày sinh với xAI API streaming
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
            model: 'grok-beta',
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
        if (error.response?.status === 403) {
            errorMessage = 'API access denied: Insufficient credits. Please purchase credits at https://console.x.ai/team/bde4d974-9d7d-468e-b26c-4bfda2885129';
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