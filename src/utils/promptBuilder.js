class PromptBuilder {
  constructor({ config }) {
    this.config = config
  }

  buildPrompt({ dobData }) {
    const { lang } = this.config
    // Nếu provider là gemini thì dùng prompt tối giản
    if (this.config.provider === 'gemini') {
      return this.buildGeminiPrompt({ dobData, lang })
    }
    if (lang === 'vi') {
      return this.buildVietnamesePrompt({ dobData })
    }
    return this.buildEnglishPrompt({ dobData })
  }

  buildGeminiPrompt({ dobData, lang }) {
    const { age, zodiac, lifeStage, daysOld } = dobData
    if (lang === 'vi') {
      return `Tuổi: ${age.years} tuổi, ${age.months} tháng, ${age.days} ngày\nCung hoàng đạo: ${zodiac}\nGiai đoạn: ${lifeStage}\nSố ngày đã sống: ${daysOld}\nLiệt kê 2-3 đặc điểm nổi bật và 1-2 gợi ý phù hợp. Dùng emoji nếu có thể.`
    }
    return `Age: ${age.years} years, ${age.months} months, ${age.days} days\nZodiac: ${zodiac}\nLife stage: ${lifeStage}\nDays lived: ${daysOld}\nList 2-3 key facts and 1-2 short suggestions for this person. Use emoji if possible.`
  }

  buildVietnamesePrompt({ dobData }) {
    const { age, zodiac, numerology, lifeStage, daysOld } = dobData

    return `Với ngày sinh sau:
- Tuổi: ${age.years} tuổi, ${age.months} tháng, ${age.days} ngày
- Cung hoàng đạo: ${zodiac}
- Giai đoạn cuộc sống: ${lifeStage}
- Số ngày đã sống: ${daysOld}

Cho mỗi mục/phần (thông tin cơ bản, tính cách, chu kỳ, sự thật thú vị, gợi ý mua sắm):
- Viết phần tóm tắt (Summary) ngắn gọn, tối đa 20 từ, 2-3 bullet, có emoji nếu phù hợp, chỉ nêu ý chính nhất.
- Nếu cần, thêm phần "Chi tiết" (Details) tối đa 30 từ, 1-2 bullet/câu, chỉ thông tin bổ sung thực sự cần thiết.
- Không lặp lại, không giải thích, không meta. Chỉ xuất ra đúng định dạng này.`
  }

  buildEnglishPrompt({ dobData }) {
    const { age, zodiac, numerology, lifeStage, daysOld } = dobData

    return `Given the following date of birth:
- Age: ${age.years} years, ${age.months} months, ${age.days} days
- Zodiac sign: ${zodiac}
- Life stage: ${lifeStage}
- Days lived: ${daysOld}

For each section/card (Basic Information, Personality, Life Cycle, Interesting Facts, Shopping Suggestions):
- Write a concise summary (max 20 words, 2-3 bullet points, each with an emoji if appropriate), only the most essential points.
- If needed, add a "Details" section (max 30 words, 1-2 bullets/sentences, only truly necessary extra info).
- Do not repeat, do not explain, no meta. Output only in this format.`
  }

  validatePrompt({ prompt }) {
    if (!prompt || typeof prompt !== 'string') {
      return false
    }
    
    if (prompt.length < 100) {
      return false
    }
    
    return true
  }
}

function createPromptBuilder({ config }) {
  return new PromptBuilder({ config })
}

module.exports = { createPromptBuilder } 