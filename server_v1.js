const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Simulate AI processing with streaming
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

    const birthDate = new Date(dob);
    console.log(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const zodiac = getZodiacSign(birthDate);

    // Simulate streaming chunks
    const chunks = [
        `Processing date of birth: ${dob}...`,
        `Calculated age: ${age} years old.`,
        `Determining zodiac sign...`,
        `Your zodiac sign is: ${zodiac}.`,
        `Analysis complete!`
    ];

    for (const chunk of chunks) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate AI processing delay
        console.log(chunk);
        res.write(`data: ${JSON.stringify({ message: chunk })}\n\n`);
    }

    res.end();
});

// Validate date format
function isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}

// Calculate zodiac sign
function getZodiacSign(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "Aries";
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "Taurus";
    if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "Gemini";
    if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "Cancer";
    if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "Leo";
    if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "Virgo";
    if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "Libra";
    if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "Scorpio";
    if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "Sagittarius";
    if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return "Capricorn";
    if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "Aquarius";
    return "Pisces";
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});