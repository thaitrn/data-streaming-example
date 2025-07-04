const axios = require('axios');

module.exports = async (req, res) => {
    const timestamp = new Date().toISOString();
    const dob = req.query.dob;
    const lang = req.query.lang === 'en' ? 'en' : 'vi';
    console.log(`[${timestamp}] Received request for /api/process-dob | dob: ${dob} | lang: ${lang}`);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    if (!dob || !isValidDate(dob)) {
        console.log(`[${timestamp}] Invalid date format received: ${dob}`);
        res.write('data: {"error": "Invalid date format"}\n\n');
        res.end();
        return;
    }

    function getCurrentDateInGMT7() {
        const now = new Date();
        const gmt7Offset = 7 * 60 * 60 * 1000;
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const gmt7 = new Date(utc + gmt7Offset);
        const yyyy = gmt7.getFullYear();
        const mm = String(gmt7.getMonth() + 1).padStart(2, '0');
        const dd = String(gmt7.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }
    const todayGmt7 = getCurrentDateInGMT7();
    const prompts = {
        vi: `Bạn là AI phân tích ngày sinh. Cho một ngày sinh, hãy tính tuổi (tính đến ngày hôm nay: ${todayGmt7} GMT+7), xác định cung hoàng đạo và đưa ra nhận xét ngắn gọn về tính cách dựa trên cung hoàng đạo. Trả lời ngắn gọn, từng phần nhỏ, dễ stream. Phân tích ngày sinh này: ${dob}`,
        en: `You are an AI that analyzes dates of birth. Given a date of birth, calculate the age (as of today: ${todayGmt7} GMT+7), determine the zodiac sign, and provide a brief personality insight based on the zodiac sign. Respond in short, streamable chunks. Analyze this date of birth: ${dob}`
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

        let buffer = '';
        let isInsideJsonArray = false;
        let braceCount = 0;
        response.data.on('data', (chunk) => {
            const chunkStr = chunk.toString();
            buffer += chunkStr;
            processBuffer();
        });
        function processBuffer() {
            let processed = false;
            while (buffer.length > 0) {
                processed = false;
                buffer = buffer.replace(/^[\s,]+/, '');
                if (buffer.length === 0) break;
                if (buffer.startsWith('[') && !isInsideJsonArray) {
                    isInsideJsonArray = true;
                    buffer = buffer.substring(1);
                    continue;
                }
                if (buffer.startsWith(']')) {
                    isInsideJsonArray = false;
                    buffer = buffer.substring(1);
                    continue;
                }
                if (buffer.startsWith('{')) {
                    braceCount = 0;
                    let jsonEnd = -1;
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
                        const jsonStr = buffer.substring(0, jsonEnd + 1);
                        buffer = buffer.substring(jsonEnd + 1);
                        try {
                            const parsed = JSON.parse(jsonStr);
                            const message = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                            if (message) {
                                const cleanMessage = message
                                    .replace(/\uFFFD/g, '')
                                    .replace(/[\x00-\x1F\x7F]/g, (char) => {
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
                            buffer = buffer.substring(1);
                            processed = true;
                        }
                    } else {
                        break;
                    }
                } else {
                    buffer = buffer.substring(1);
                    processed = true;
                }
                if (!processed) break;
            }
        }
        response.data.on('end', () => {
            console.log(`[${timestamp}] Gemini API stream ended`);
            if (buffer.trim()) {
                console.log(`[${timestamp}] Remaining buffer:`, buffer);
                processBuffer();
            }
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

    function isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }
};