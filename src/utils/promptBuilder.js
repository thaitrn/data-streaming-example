class PromptBuilder {
  constructor({ config }) {
    this.config = config
  }

  buildPrompt({ dobData }) {
    const { lang } = this.config
    
    if (lang === 'vi') {
      return this.buildVietnamesePrompt({ dobData })
    }
    
    return this.buildEnglishPrompt({ dobData })
  }

  buildVietnamesePrompt({ dobData }) {
    const { age, zodiac, numerology, lifeStage, daysOld, famousBirthdays, historicalEvent, milestones, shoppingSuggestions } = dobData

    return `Phân tích chi tiết về ngày sinh ${dobData.dob}:

**Thông tin cơ bản:**
- Tuổi: ${age.years} tuổi, ${age.months} tháng, ${age.days} ngày
- Cung hoàng đạo: ${zodiac}
- Giai đoạn cuộc sống: ${lifeStage}
- Số ngày đã sống: ${daysOld} ngày

**Tính cách và đặc điểm:**
- Cung hoàng đạo: ${zodiac}
- Thần số học: Số ${numerology}
- Đặc điểm tính cách dựa trên cung hoàng đạo và thần số học

**Phân tích chu kỳ cuộc sống:**
- Giai đoạn hiện tại: ${lifeStage}
- Các cột mốc quan trọng: ${milestones.join(', ')}

**Sự thật thú vị:**
- Người nổi tiếng sinh cùng ngày: ${famousBirthdays}
- Sự kiện lịch sử: ${historicalEvent}

**Gợi ý mua sắm phù hợp:**
${shoppingSuggestions.map(item => `- ${item}`).join('\n')}

Hãy phân tích chi tiết và đưa ra những insight sâu sắc về cuộc sống, tính cách, và tiềm năng của người này. Sử dụng markdown để format đẹp mắt.`
  }

  buildEnglishPrompt({ dobData }) {
    const { age, zodiac, numerology, lifeStage, daysOld, famousBirthdays, historicalEvent, milestones, shoppingSuggestions } = dobData

    return `Analyze the date of birth ${dobData.dob} in detail:

**Basic Information:**
- Age: ${age.years} years, ${age.months} months, ${age.days} days
- Zodiac Sign: ${zodiac}
- Life Stage: ${lifeStage}
- Days Lived: ${daysOld} days

**Personality and Characteristics:**
- Zodiac Sign: ${zodiac}
- Numerology: Number ${numerology}
- Personality traits based on zodiac sign and numerology

**Life Cycle Analysis:**
- Current Stage: ${lifeStage}
- Major Milestones: ${milestones.join(', ')}

**Interesting Facts:**
- Famous people born on this date: ${famousBirthdays}
- Historical event: ${historicalEvent}

**Shopping Suggestions:**
${shoppingSuggestions.map(item => `- ${item}`).join('\n')}

Please provide a detailed analysis with deep insights about this person's life, personality, and potential. Use markdown formatting for better readability.`
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