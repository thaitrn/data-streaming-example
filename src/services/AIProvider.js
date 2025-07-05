const axios = require('axios')

class AIProvider {
  constructor({ config }) {
    this.config = config
  }

  async getResponse({ prompt, lang }) {
    throw new Error('Not implemented')
  }
  
  handleError({ error, context }) {
    console.error(`[ERROR] ${context}:`, error.message)
    throw new Error(`${context}: ${error.message}`)
  }
}

class GeminiProvider extends AIProvider {
  async getResponse({ prompt, lang }) {
    if (!this.config.apiKey) {
      throw new Error('Gemini API key is required')
    }

    try {
      const response = await axios({
        method: 'post',
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${this.config.apiKey}`,
        headers: { 'Content-Type': 'application/json' },
        data: {
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ]
        },
        responseType: 'stream'
      })

      return response
    } catch (error) {
      this.handleError({ error, context: 'GeminiProvider' })
    }
  }
}

class LMStudioProvider extends AIProvider {
  async getResponse({ prompt, lang }) {
    const baseUrl = this.config.baseUrl || 'http://localhost:1234'

    try {
      const response = await axios.post(
        `${baseUrl}/v1/chat/completions`,
        {
          model: this.config.model || 'local-model',
          messages: [
            { 
              role: 'system', 
              content: 'You are an AI that analyzes dates of birth and provides comprehensive insights. Use markdown formatting for better readability.' 
            },
            { role: 'user', content: prompt }
          ],
          stream: true
        },
        { 
          headers: { 'Content-Type': 'application/json' },
          responseType: 'stream'
        }
      )

      return response
    } catch (error) {
      this.handleError({ error, context: 'LMStudioProvider' })
    }
  }
}

class LocalFallbackProvider extends AIProvider {
  async getResponse({ prompt, lang }) {
    // Simulate streaming response for local fallback
    const mockResponse = {
      data: {
        on: (event, callback) => {
          if (event === 'data') {
            // Simulate streaming chunks
            const chunks = this.generateLocalResponse({ lang })
            chunks.forEach((chunk, index) => {
              setTimeout(() => {
                callback(Buffer.from(`data: ${JSON.stringify({ chunk })}\n\n`))
              }, index * 50)
            })
            setTimeout(() => {
              callback(Buffer.from('data: [DONE]\n\n'))
            }, chunks.length * 50)
          }
        }
      }
    }

    return Promise.resolve(mockResponse)
  }

  generateLocalResponse({ lang }) {
    const response = lang === 'en' 
      ? this.getEnglishFallbackResponse()
      : this.getVietnameseFallbackResponse()
    
    return response.split(' ').map(word => word + ' ')
  }

  getEnglishFallbackResponse() {
    return `# Personal Insights Analysis

## Basic Information
**Your Age:** 25 years, 6 months, and 15 days
**Zodiac Sign:** Leo
**Life Stage:** Young Adult

## Personality Traits
**Zodiac:** Leo
**Key Traits:** Based on your zodiac sign, you likely possess unique characteristics that define your personality.
**Numerology:** Your number is 7 – Intellect and introspection.

## Life Cycle Analysis
**Current Stage:** Young Adult
**Major Milestones:**
- Xây dựng sự nghiệp
- Tìm kiếm sự ổn định
- Phát triển bản thân

## Interesting Facts
You are approximately **9,315 days old**.
Famous people born on your date: No major celebrities found
On your 10th birthday, this happened: No major event found for that year.

## Shopping Suggestions
**Suggestions for Leo:**
- Đá mắt hổ
- Trang sức vàng
- Đồ decor sang trọng
- Đồ decor văn phòng, đồng hồ, vật phẩm phong thuỷ cho sự nghiệp

*This analysis was generated using local calculations while AI services are unavailable.*`
  }

  getVietnameseFallbackResponse() {
    return `# Phân tích Thông tin Cá nhân

## Thông tin cơ bản
**Tuổi của bạn:** 25 tuổi, 6 tháng, và 15 ngày
**Cung hoàng đạo:** Leo
**Giai đoạn cuộc sống:** Young Adult

## Tính cách
**Cung hoàng đạo:** Leo
**Đặc điểm chính:** Dựa trên cung hoàng đạo của bạn, bạn có khả năng sở hữu những đặc điểm độc đáo định nghĩa tính cách của mình.
**Thần số học:** Số của bạn là 7 – Intellect and introspection.

## Phân tích Chu kỳ Cuộc sống
**Giai đoạn hiện tại:** Young Adult
**Các cột mốc quan trọng:**
- Xây dựng sự nghiệp
- Tìm kiếm sự ổn định
- Phát triển bản thân

## Sự thật thú vị
Bạn đã sống khoảng **9,315 ngày**.
Những người nổi tiếng sinh cùng ngày: No major celebrities found
Vào sinh nhật thứ 10 của bạn, điều này đã xảy ra: No major event found for that year.

## Gợi ý mua sắm
**Gợi ý cho Leo:**
- Đá mắt hổ
- Trang sức vàng
- Đồ decor sang trọng
- Đồ decor văn phòng, đồng hồ, vật phẩm phong thuỷ cho sự nghiệp

*Phân tích này được tạo ra bằng các tính toán cục bộ khi dịch vụ AI không khả dụng.*`
  }
}

function createAIProvider({ config }) {
  const useGemini = process.env.USE_GEMINI === '1'
  
  if (useGemini) {
    return new GeminiProvider({ config })
  }
  
  if (config.baseUrl) {
    return new LMStudioProvider({ config })
  }
  
  return new LocalFallbackProvider({ config })
}

module.exports = { createAIProvider } 