const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Endpoint to process date of birth with Gemini API streaming
app.get('/process-dob/:dob', async (req, res) => {
    const timestamp = new Date().toISOString();
    const dob = req.params.dob;
    const lang = req.query.lang === 'en' ? 'en' : 'vi';
    console.log(`[${timestamp}] Received request for /process-dob | dob: ${dob} | lang: ${lang}`);
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    if (!isValidDate(dob)) {
        console.log(`[${timestamp}] Invalid date format received: ${dob}`);
        res.write('data: {"error": "Invalid date format"}\n\n');
        res.end();
        return;
    }

    // Calculate current date in GMT+7
    function getCurrentDateInGMT7() {
        const now = new Date();
        // Convert to milliseconds for GMT+7
        const gmt7Offset = 7 * 60 * 60 * 1000;
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const gmt7 = new Date(utc + gmt7Offset);
        // Format as YYYY-MM-DD
        const yyyy = gmt7.getFullYear();
        const mm = String(gmt7.getMonth() + 1).padStart(2, '0');
        const dd = String(gmt7.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }
    const todayGmt7 = getCurrentDateInGMT7();

    // Prompt in both languages, include todayGmt7
    const prompts = {
        vi: `Bạn là AI phân tích ngày sinh. Cho một ngày sinh, hãy tính tuổi (tính đến ngày hôm nay: ${todayGmt7} GMT+7), xác định cung hoàng đạo và đưa ra nhận xét ngắn gọn về tính cách dựa trên cung hoàng đạo. Trả lời ngắn gọn, từng phần nhỏ, dễ stream. Phân tích ngày sinh này: ${dob}`,
        en: `You are an AI that analyzes dates of birth. Given a date of birth, calculate the age (as of today: ${todayGmt7} GMT+7), determine the zodiac sign, and provide a brief personality insight based on the zodiac sign. Respond in short, streamable chunks. Analyze this date of birth: ${dob}`,
        en_today: `Today is ${todayGmt7} (GMT+7). Based on this date, calculate the age...`
    };
    console.log(`[${timestamp}] Prompt sent to Gemini: ${prompts[lang]}`);

    try {
        console.log(`[${timestamp}] Sending request to Gemini API...`);
        const response = await axios({
            method: 'post',
            url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${process.env.GEMINI_API_KEY}`,
            headers: { 'Content-Type': 'application/json' },
            data: {
                contents: [
                    {
                        parts: [
                            {
                                text: prompts[lang]
                            }
                        ]
                    }
                ]
            },
            responseType: 'stream'
        });

        // Buffer for accumulating incomplete data
        let buffer = '';
        let isInsideJsonArray = false;
        let braceCount = 0;
        
        response.data.on('data', (chunk) => {
            const chunkStr = chunk.toString();
            buffer += chunkStr;
            
            // Process the buffer
            processBuffer();
        });
        
        function processBuffer() {
            let processed = false;
            
            // Try to extract complete JSON objects from the buffer
            while (buffer.length > 0) {
                processed = false;
                
                // Skip whitespace and commas at the beginning
                buffer = buffer.replace(/^[\s,]+/, '');
                
                if (buffer.length === 0) break;
                
                // Handle array start
                if (buffer.startsWith('[') && !isInsideJsonArray) {
                    isInsideJsonArray = true;
                    buffer = buffer.substring(1);
                    continue;
                }
                
                // Handle array end
                if (buffer.startsWith(']')) {
                    isInsideJsonArray = false;
                    buffer = buffer.substring(1);
                    continue;
                }
                
                // Try to extract a complete JSON object
                if (buffer.startsWith('{')) {
                    braceCount = 0;
                    let jsonEnd = -1;
                    
                    // Find the matching closing brace
                    for (let i = 0; i < buffer.length; i++) {
                        if (buffer[i] === '{') {
                            braceCount++;
                        } else if (buffer[i] === '}') {
                            braceCount--;
                            if (braceCount === 0) {
                                jsonEnd = i;
                                break;
                            }
                        }
                    }
                    
                    if (jsonEnd !== -1) {
                        // Extract complete JSON object
                        const jsonStr = buffer.substring(0, jsonEnd + 1);
                        buffer = buffer.substring(jsonEnd + 1);
                        
                        try {
                            const parsed = JSON.parse(jsonStr);
                            const message = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                            
                            if (message) {
                                // Clean up the message - remove excessive whitespace and control characters
                                const cleanMessage = message
                                    .replace(/\uFFFD/g, '') // Remove replacement characters
                                    .replace(/[\x00-\x1F\x7F]/g, (char) => {
                                        // Keep newlines and tabs, remove other control characters
                                        return char === '\n' || char === '\t' ? char : '';
                                    })
                                    .trim();
                                
                                if (cleanMessage) {
                                    console.log(`[${timestamp}] Processed message: ${cleanMessage}`);
                                    res.write(`data: ${JSON.stringify({ text: cleanMessage })}\n\n`);
                                }
                            }
                            processed = true;
                        } catch (e) {
                            console.log(`[${timestamp}] JSON parse error:`, e.message);
                            console.log(`[${timestamp}] Problematic JSON:`, jsonStr);
                            // Remove the problematic part and continue
                            buffer = buffer.substring(1);
                            processed = true;
                        }
                    } else {
                        // Incomplete JSON object, wait for more data
                        break;
                    }
                } else {
                    // Remove invalid characters at the beginning
                    buffer = buffer.substring(1);
                    processed = true;
                }
                
                if (!processed) break;
            }
        }
        
        response.data.on('end', () => {
            console.log(`[${timestamp}] Gemini API stream ended`);
            
            // Process any remaining buffer content
            if (buffer.trim()) {
                console.log(`[${timestamp}] Remaining buffer:`, buffer);
                processBuffer();
            }
            
            // Send end signal
            res.write('data: {"end": true}\n\n');
            res.end();
        });
        
        response.data.on('error', (error) => {
            console.error(`[${timestamp}] Gemini API stream error:`, error);
            res.write(`data: ${JSON.stringify({ error: 'Stream error occurred' })}\n\n`);
            res.end();
        });
        
    } catch (error) {
        let errorMessage = error.message;
        if (error.response?.status === 403) {
            errorMessage = 'API access denied: Invalid or insufficient API key. Please check your Gemini API key at https://aistudio.google.com/app/apikey';
        } else if (error.response?.status === 429) {
            errorMessage = 'API quota exceeded. Check your usage limits at https://aistudio.google.com/app/apikey or enable billing for higher limits.';
        }
        console.error(`[${timestamp}] Gemini API error:`, error.stack || error);
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