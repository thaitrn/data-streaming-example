const axios = require('axios');
require('dotenv').config();

// --- SOLID: Service Classes for Business Logic ---
class DOBAnalyzer {
    constructor(dob) {
        this.dob = dob;
        this.birthDate = new Date(dob);
        this.today = new Date();
    }
    getAge() {
        const age = (() => {
            let years = this.today.getFullYear() - this.birthDate.getFullYear();
            let months = this.today.getMonth() - this.birthDate.getMonth();
            let days = this.today.getDate() - this.birthDate.getDate();
            if (days < 0) {
                months--;
                days += new Date(this.today.getFullYear(), this.today.getMonth(), 0).getDate();
            }
            if (months < 0) {
                years--;
                months += 12;
            }
            return { years, months, days };
        })();
        console.info('[INFO] Calculated age:', age);
        return age;
    }
    getZodiacSign() {
        const date = this.birthDate.getDate();
        const month = this.birthDate.getMonth() + 1;
        const signs = [
            { name: 'Capricorn', dates: [22, 19] },
            { name: 'Aquarius', dates: [20, 18] },
            { name: 'Pisces', dates: [19, 20] },
            { name: 'Aries', dates: [21, 19] },
            { name: 'Taurus', dates: [20, 20] },
            { name: 'Gemini', dates: [21, 20] },
            { name: 'Cancer', dates: [21, 22] },
            { name: 'Leo', dates: [23, 22] },
            { name: 'Virgo', dates: [23, 22] },
            { name: 'Libra', dates: [23, 22] },
            { name: 'Scorpio', dates: [23, 21] },
            { name: 'Sagittarius', dates: [22, 21] }
        ];
        const currentSign = signs[month - 1];
        const zodiac = (date >= currentSign.dates[0] || date <= currentSign.dates[1]) ? currentSign.name : signs[month % 12].name;
        console.info('[INFO] Zodiac sign:', zodiac);
        return zodiac;
    }
    getLifeStage() {
        const age = this.getAge().years;
        let stage = '';
        if (age < 13) stage = 'Childhood';
        else if (age < 20) stage = 'Adolescence';
        else if (age < 40) stage = 'Young Adult';
        else if (age < 60) stage = 'Middle Age';
        else stage = 'Senior';
        console.info('[INFO] Life stage:', stage);
        return stage;
    }
    getNumerology() {
        const digits = this.dob.replace(/-/g, '').split('').map(Number);
        let sum = digits.reduce((a, b) => a + b, 0);
        while (sum > 9) sum = sum.toString().split('').reduce((a, b) => a + +b, 0);
        console.info('[INFO] Numerology number:', sum);
        return sum;
    }
    getNumerologyFact(num) {
        const facts = {
            1: 'Leadership and independence.',
            2: 'Harmony and partnership.',
            3: 'Creativity and joy.',
            4: 'Stability and discipline.',
            5: 'Adventure and freedom.',
            6: 'Care and responsibility.',
            7: 'Intellect and introspection.',
            8: 'Power and ambition.',
            9: 'Compassion and idealism.'
        };
        const fact = facts[num] || 'A unique number!';
        console.info('[INFO] Numerology fact:', fact);
        return fact;
    }
    getFamousBirthdays() {
        const monthDay = this.dob.slice(5);
        const famous = {
            '01-01': 'Paul Revere, Verne Troyer',
            '07-20': 'Alexander the Great, Gisele Bündchen',
            '12-25': 'Isaac Newton, Justin Trudeau',
        };
        const result = famous[monthDay] || 'No major celebrities found (try 01-01, 07-20, 12-25)';
        console.info('[INFO] Famous birthdays:', result);
        return result;
    }
    getHistoricalEvent(yearsAfter) {
        const year = this.birthDate.getFullYear() + yearsAfter;
        const events = {
            2000: 'Y2K bug was a big topic!',
            2010: 'Instagram was launched.',
            2020: 'Global COVID-19 pandemic.',
        };
        const result = events[year] || 'No major event found for that year.';
        console.info(`[INFO] Historical event for year ${year}:`, result);
        return result;
    }
    getDaysOld() {
        const days = Math.floor((this.today - this.birthDate) / (1000 * 60 * 60 * 24));
        console.info('[INFO] Days old:', days);
        return days;
    }
    getLifeMilestones() {
        const age = this.getAge().years;
        let milestones = [];
        if (age < 13) milestones = ['Khám phá bản thân', 'Học hỏi kỹ năng cơ bản', 'Tạo dựng nền tảng gia đình'];
        else if (age < 20) milestones = ['Phát triển cá tính', 'Tìm kiếm đam mê', 'Kết bạn và xây dựng các mối quan hệ'];
        else if (age < 40) milestones = ['Xây dựng sự nghiệp', 'Tìm kiếm sự ổn định', 'Phát triển bản thân'];
        else if (age < 60) milestones = ['Ổn định tài chính', 'Chia sẻ kinh nghiệm', 'Chăm sóc sức khỏe'];
        else milestones = ['Tận hưởng cuộc sống', 'Gắn kết gia đình', 'Truyền cảm hứng cho thế hệ sau'];
        console.info('[INFO] Life milestones:', milestones);
        return milestones;
    }
    getShoppingSuggestions(zodiac, age) {
        const map = {
            'Aries': ['Đá ruby', 'Vật phẩm màu đỏ', 'Đồng hồ thể thao'],
            'Taurus': ['Đá thạch anh hồng', 'Cây xanh nhỏ', 'Đồ trang trí gốm'],
            'Gemini': ['Sách', 'Bút ký', 'Phụ kiện đa năng'],
            'Cancer': ['Đá mặt trăng', 'Khung ảnh gia đình', 'Nến thơm'],
            'Leo': ['Đá mắt hổ', 'Trang sức vàng', 'Đồ decor sang trọng'],
            'Virgo': ['Đá ngọc lục bảo', 'Sổ tay', 'Cây để bàn'],
            'Libra': ['Đá thạch anh tím', 'Nước hoa', 'Tranh nghệ thuật'],
            'Scorpio': ['Đá obsidian', 'Vòng tay phong thuỷ', 'Nước hoa bí ẩn'],
            'Sagittarius': ['Đá ngọc lam', 'Balo du lịch', 'Sách khám phá'],
            'Capricorn': ['Đá mã não', 'Đồng hồ', 'Vật phẩm màu nâu/xám'],
            'Aquarius': ['Đá sapphire', 'Đồ công nghệ', 'Phụ kiện độc lạ'],
            'Pisces': ['Đá aquamarine', 'Đèn ngủ', 'Đồ decor biển']
        };
        let shoppingList = map[zodiac] || ['Vật phẩm phong thuỷ hợp mệnh', 'Đồ trang trí mang lại may mắn'];
        if (age < 13) shoppingList.push('Đồ chơi giáo dục, sách tranh, vật phẩm an toàn cho trẻ nhỏ');
        else if (age < 20) shoppingList.push('Sách phát triển bản thân, phụ kiện cá tính, đồ thể thao');
        else if (age < 40) shoppingList.push('Đồ decor văn phòng, đồng hồ, vật phẩm phong thuỷ cho sự nghiệp');
        else if (age < 60) shoppingList.push('Đồ chăm sóc sức khoẻ, cây cảnh, vật phẩm thư giãn');
        else shoppingList.push('Đồ dưỡng sinh, vật phẩm an lạc, sách truyền cảm hứng');
        console.info('[INFO] Shopping suggestions:', shoppingList);
        return shoppingList;
    }
}

// --- AI Provider Abstraction (already SOLID) ---
class AIProvider {
    async getResponse(prompt, lang, timestamp) {
        throw new Error('Not implemented');
    }
}
class GeminiProvider extends AIProvider {
    async getResponse(prompt, lang, timestamp) {
        console.info(`[INFO] [${timestamp}] [GEMINI] Sending request to Gemini API...`);
        try {
            const response = await axios({
                method: 'post',
                url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${process.env.GEMINI_API_KEY}`,
                headers: { 'Content-Type': 'application/json' },
                data: {
                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ]
                },
                responseType: 'stream'
            });
            return response;
        } catch (error) {
            console.error('[ERROR] GeminiProvider error:', error);
            throw error;
        }
    }
}
class LMStudioProvider extends AIProvider {
    async getResponse(prompt, lang, timestamp) {
        console.info(`[INFO] [${timestamp}] [LM] About to call LM Studio API`);
        try {
            const lmUrl = process.env.LM_STUDIO_URL || 'http://localhost:1234';
            const lmResponse = await axios.post(
                lmUrl + '/v1/chat/completions',
                {
                    model: "local-model",
                    messages: [
                        { role: "system", content: "You are an AI that analyzes dates of birth and provides comprehensive insights. Use markdown formatting for better readability." },
                        { role: "user", content: prompt }
                    ],
                    stream: true
                },
                { 
                    headers: { "Content-Type": "application/json" },
                    responseType: 'stream'
                }
            );
            console.info('[INFO] [LM] LM Studio API prompt:', prompt);
            console.info('[INFO] [LM] LM Studio API response status:', lmResponse.status);
            return lmResponse;
        } catch (error) {
            console.error('[ERROR] LMStudioProvider error:', error);
            throw error;
        }
    }
}
function getAIProvider() {
    // Use USE_GEMINI from .env: if '1' use Gemini, else LM Studio
    return process.env.USE_GEMINI === '1' ? new GeminiProvider() : new LMStudioProvider();
}

// --- Main Handler: Only coordinates, delegates all logic ---
module.exports = async (req, res) => {
    const timestamp = new Date().toISOString();
    const dob = req.query.dob;
    const lang = req.query.lang === 'en' ? 'en' : 'vi';
    const useGemini = process.env.USE_GEMINI === '1';
    console.info(`[INFO] [${timestamp}] [START] /api/process-dob | dob: ${dob} | lang: ${lang} | engine: ${useGemini ? 'Gemini' : 'LM Studio'}`);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    if (res.flushHeaders) res.flushHeaders();

    try {
        if (!dob || !isValidDate(dob)) {
            console.error(`[ERROR] [${timestamp}] Invalid date format received: ${dob}`);
            res.write('data: {"error": "Invalid date format"}\n\n');
            res.end();
            return;
        }

        // --- Get basic data for AI prompt ---
        console.info('[INFO] [STEP] Getting basic data for AI prompt...');
        const analyzer = new DOBAnalyzer(dob);
        const age = analyzer.getAge();
        const zodiac = analyzer.getZodiacSign();
        const numerologyNum = analyzer.getNumerology();

        // --- Construct AI prompt ---
        const prompt = constructAIPrompt(dob, age, zodiac, numerologyNum, lang);
        // console.info(`[INFO] [STEP] Constructed AI prompt (${lang}):`, prompt.substring(0, 200) + '...');
        console.info(`[INFO] [STEP] Constructed AI prompt (${lang}):`, prompt + '...');

        // --- Get AI provider and stream response ---
        console.info('[INFO] [STEP] Getting AI provider...');
        const aiProvider = getAIProvider();
        
        // Check if Gemini API key is available when using Gemini
        if (useGemini && !process.env.GEMINI_API_KEY) {
            console.warn('[WARN] Gemini API key not found, falling back to local analysis...');
            const fallbackResponse = generateLocalFallbackResponse(analyzer, lang);
            const chunks = fallbackResponse.split(' ').map(word => word + ' ');
            for (let i = 0; i < chunks.length; i++) {
                res.write(`data: ${JSON.stringify({ chunk: chunks[i] })}\n\n`);
                if (res.flush) res.flush();
                await new Promise(resolve => setTimeout(resolve, 30));
            }
            res.write('data: {"end": true}\n\n');
            res.end();
            console.info(`[INFO] [${timestamp}] [END] Local fallback response sent.`);
            return;
        }
        
        if (!useGemini) {
            // LM Studio supports streaming
            console.info('[INFO] [STEP] Using LM Studio (streaming)...');
            try {
                const aiResponse = await aiProvider.getResponse(prompt, lang, timestamp);
                
                // Stream LM Studio response to client
                aiResponse.data.on('data', (chunk) => {
                    const lines = chunk.toString().split('\n');
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);
                            if (data === '[DONE]') {
                                res.write('data: {"end": true}\n\n');
                                if (res.flush) res.flush();
                                console.log('[SENT][LMStudio] end to FE');
                                return;
                            }
                            try {
                                const parsed = JSON.parse(data);
                                if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                                    const text = parsed.choices[0].delta.content;
                                    if (text) {
                                        console.log('[STREAM][LMStudio] chunk:', text);
                                        res.write(`data: ${JSON.stringify({ chunk: text })}\n\n`);
                                        if (res.flush) res.flush();
                                        console.log('[SENT][LMStudio] chunk to FE');
                                    }
                                }
                            } catch (e) {
                                // Log parsing errors for debugging but continue
                                console.debug('[DEBUG] JSON parsing error:', e.message, 'for data:', data);
                            }
                        }
                    }
                });

                aiResponse.data.on('end', () => {
                    res.write('data: {"end": true}\n\n');
                    if (res.flush) res.flush();
                    console.log('[SENT][LMStudio] end to FE');
                });
            } catch (lmError) {
                console.error('[ERROR] LM Studio error:', lmError.message);
                console.error('[ERROR] Falling back to local analysis...');
                // Fallback to local analysis when LM Studio is not available
                const fallbackResponse = generateLocalFallbackResponse(analyzer, lang);
                const chunks = fallbackResponse.split(' ').map(word => word + ' ');
                for (let i = 0; i < chunks.length; i++) {
                    res.write(`data: ${JSON.stringify({ chunk: chunks[i] })}\n\n`);
                    if (res.flush) res.flush();
                    await new Promise(resolve => setTimeout(resolve, 30)); // Faster for local
                }
                res.write('data: {"end": true}\n\n');
            }
        } else {
            // Gemini supports streaming
            console.info('[INFO] [STEP] Using Gemini (streaming)...');
            try {
                const aiResponse = await aiProvider.getResponse(prompt, lang, timestamp);
                
                // Stream Gemini response to client
                aiResponse.data.on('data', (chunk) => {
                    const lines = chunk.toString().split('\n');
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);
                            if (data === '[DONE]') {
                                res.write('data: {"end": true}\n\n');
                                if (res.flush) res.flush();
                                console.log('[SENT][Gemini] end to FE');
                                return;
                            }
                            try {
                                const parsed = JSON.parse(data);
                                if (parsed.candidates && parsed.candidates[0] && parsed.candidates[0].content && parsed.candidates[0].content.parts) {
                                    const text = parsed.candidates[0].content.parts[0].text;
                                    if (text) {
                                        console.log(`[STREAM][Gemini] chunk:`, text);
                                        res.write(`data: ${JSON.stringify({ chunk: text })}\n\n`);
                                        if (res.flush) res.flush();
                                        console.log('[SENT][Gemini] chunk to FE');
                                    }
                                }
                            } catch (e) {
                                // Ignore parsing errors for incomplete JSON
                            }
                        }
                    }
                });

                aiResponse.data.on('end', () => {
                    res.write('data: {"end": true}\n\n');
                    if (res.flush) res.flush();
                    console.log('[SENT][Gemini] end to FE');
                });
            } catch (geminiError) {
                console.error('[ERROR] Gemini API not available, falling back to local analysis...');
                // Fallback to local analysis when Gemini is not available
                const fallbackResponse = generateLocalFallbackResponse(analyzer, lang);
                const chunks = fallbackResponse.split(' ').map(word => word + ' ');
                for (let i = 0; i < chunks.length; i++) {
                    res.write(`data: ${JSON.stringify({ chunk: chunks[i] })}\n\n`);
                    if (res.flush) res.flush();
                    await new Promise(resolve => setTimeout(resolve, 30)); // Faster for local
                }
            }
        }
    } catch (error) {
        console.error(`[ERROR] [${timestamp}] Unhandled error:`, error);
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    }
};

function generateLocalFallbackResponse(analyzer, lang) {
    const age = analyzer.getAge();
    const zodiac = analyzer.getZodiacSign();
    const lifeStage = analyzer.getLifeStage();
    const numerologyNum = analyzer.getNumerology();
    const numerologyFact = analyzer.getNumerologyFact(numerologyNum);
    const daysOld = analyzer.getDaysOld();
    const famous = analyzer.getFamousBirthdays();
    const event = analyzer.getHistoricalEvent(10);
    const milestones = analyzer.getLifeMilestones();
    const shoppingList = analyzer.getShoppingSuggestions(zodiac, age.years);

    if (lang === 'en') {
        return `# Personal Insights Analysis

## Basic Information
**Your Age:** ${age.years} years, ${age.months} months, and ${age.days} days
**Zodiac Sign:** ${zodiac}
**Life Stage:** ${lifeStage}

## Personality Traits
**Zodiac:** ${zodiac}
**Key Traits:** Based on your zodiac sign, you likely possess unique characteristics that define your personality.
**Numerology:** Your number is ${numerologyNum} – ${numerologyFact}

## Life Cycle Analysis
**Current Stage:** ${lifeStage}
**Major Milestones:**
- ${milestones.join('\n- ')}

## Interesting Facts
You are approximately **${daysOld} days old**.
Famous people born on your date: ${famous}
On your 10th birthday, this happened: ${event}

## Shopping Suggestions
**Suggestions for ${zodiac}:**
- ${shoppingList.join('\n- ')}

*This analysis was generated using local calculations while AI services are unavailable.*`;
    } else {
        return `# Phân tích Thông tin Cá nhân

## Thông tin cơ bản
**Tuổi của bạn:** ${age.years} tuổi, ${age.months} tháng, và ${age.days} ngày
**Cung hoàng đạo:** ${zodiac}
**Giai đoạn cuộc sống:** ${lifeStage}

## Tính cách
**Cung hoàng đạo:** ${zodiac}
**Đặc điểm chính:** Dựa trên cung hoàng đạo của bạn, bạn có khả năng sở hữu những đặc điểm độc đáo định nghĩa tính cách của mình.
**Thần số học:** Số của bạn là ${numerologyNum} – ${numerologyFact}

## Phân tích Chu kỳ Cuộc sống
**Giai đoạn hiện tại:** ${lifeStage}
**Các cột mốc quan trọng:**
- ${milestones.join('\n- ')}

## Sự thật thú vị
Bạn đã sống khoảng **${daysOld} ngày**.
Những người nổi tiếng sinh cùng ngày: ${famous}
Vào sinh nhật thứ 10 của bạn, điều này đã xảy ra: ${event}

## Gợi ý mua sắm
**Gợi ý cho ${zodiac}:**
- ${shoppingList.join('\n- ')}

*Phân tích này được tạo ra bằng các tính toán cục bộ khi dịch vụ AI không khả dụng.*`;
    }
}

function constructAIPrompt(dob, age, zodiac, numerologyNum, lang) {
    if (lang === 'en') {
        return `Analyze this date of birth: ${dob}

Basic Information:
- Age: ${age.years} years, ${age.months} months, ${age.days} days
- Zodiac Sign: ${zodiac}
- Numerology Number: ${numerologyNum}

Please provide a comprehensive analysis including:

1. **Basic Info**: Age details, zodiac sign, and life stage
2. **Personality Traits**: Based on zodiac sign and numerology
3. **Life Cycle**: Current life stage and major milestones
4. **Interesting Facts**: Days lived, famous birthdays, historical events
5. **Shopping Suggestions**: Personalized recommendations based on zodiac and age

Make the response engaging, personal, and insightful. Use markdown formatting for better readability.`;
    } else {
        return `Phân tích ngày sinh: ${dob}

Thông tin cơ bản:
- Tuổi: ${age.years} tuổi, ${age.months} tháng, ${age.days} ngày
- Cung hoàng đạo: ${zodiac}
- Số thần số học: ${numerologyNum}

Vui lòng cung cấp phân tích toàn diện bao gồm:

1. **Thông tin cơ bản**: Chi tiết tuổi, cung hoàng đạo và giai đoạn cuộc sống
2. **Tính cách**: Dựa trên cung hoàng đạo và thần số học
3. **Chu kỳ cuộc sống**: Giai đoạn hiện tại và các cột mốc quan trọng
4. **Sự thật thú vị**: Số ngày đã sống, người nổi tiếng cùng ngày sinh, sự kiện lịch sử
5. **Gợi ý mua sắm**: Khuyến nghị cá nhân hóa dựa trên cung hoàng đạo và tuổi

Hãy làm cho câu trả lời hấp dẫn, cá nhân và sâu sắc. Sử dụng định dạng markdown để dễ đọc hơn.`;
    }
}

function isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}