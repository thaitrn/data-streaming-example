const { DOBAnalyzer } = require('../services/DOBAnalyzer')
const { createAIProvider } = require('../services/AIProvider')
const { createPromptBuilder } = require('../utils/promptBuilder')

class ProcessDOBHandler {
  constructor({ config }) {
    this.config = config
  }

  async handle({ req, res }) {
    const timestamp = new Date().toISOString()
    const { dob, lang } = req.query

    console.info(`[INFO] [${timestamp}] [START] /api/process-dob | dob: ${dob} | lang: ${lang}`)

    try {
      // Validate input
      this.validateRequest({ dob, lang })

      // Set response headers for streaming
      this.setStreamHeaders({ res })

      // Analyze DOB data
      const dobData = await this.analyzeDOB({ dob })

      // Build AI prompt
      const prompt = await this.buildPrompt({ dobData, lang })

      // Get AI response
      await this.streamAIResponse({ prompt, lang, res })

      console.info(`[INFO] [${timestamp}] [END] Successfully processed DOB request`)
    } catch (error) {
      this.handleError({ error, res, timestamp })
    }
  }

  validateRequest({ dob, lang }) {
    if (!dob || !this.isValidDate({ date: dob })) {
      throw new Error('Invalid date format')
    }

    if (!['vi', 'en'].includes(lang)) {
      throw new Error('Invalid language parameter')
    }
  }

  isValidDate({ date }) {
    const parsedDate = new Date(date)
    return parsedDate instanceof Date && !isNaN(parsedDate.getTime())
  }

  setStreamHeaders({ res }) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    
    if (res.flushHeaders) {
      res.flushHeaders()
    }
  }

  async analyzeDOB({ dob }) {
    const analyzer = new DOBAnalyzer({ dob })
    return analyzer.getAllData()
  }

  async buildPrompt({ dobData, lang }) {
    const promptBuilder = createPromptBuilder({ 
      config: { ...this.config.promptConfig, lang: lang } 
    })
    
    const prompt = promptBuilder.buildPrompt({ dobData })
    
    if (!promptBuilder.validatePrompt({ prompt })) {
      throw new Error('Invalid prompt generated')
    }

    return prompt
  }

  async streamAIResponse({ prompt, lang, res }) {
    const aiProvider = createAIProvider({ config: this.config.aiConfig })

    try {
      const aiResponse = await aiProvider.getResponse({ prompt, lang })
      
      aiResponse.data.on('data', (chunk) => {
        this.processStreamChunk({ chunk, res })
      })

      aiResponse.data.on('end', () => {
        this.sendEndSignal({ res })
      })

      aiResponse.data.on('error', (error) => {
        console.error('[ERROR] AI stream error:', error.message)
        this.sendErrorSignal({ error: error.message, res })
      })
    } catch (error) {
      console.error('[ERROR] AI provider error:', error)
      await this.sendFallbackResponse({ lang, res })
    }
  }

  processStreamChunk({ chunk, res }) {
    const lines = chunk.toString().split('\n')
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6)
        
        if (data === '[DONE]') {
          this.sendEndSignal({ res })
          return
        }

        try {
          const parsed = JSON.parse(data)
          this.handleParsedChunk({ parsed, res })
        } catch (error) {
          console.debug('[DEBUG] JSON parsing error:', error.message, 'for data:', data)
        }
      }
    }
  }

  handleParsedChunk({ parsed, res }) {
    // Handle Gemini response
    if (parsed.candidates?.[0]?.content?.parts?.[0]?.text) {
      const text = parsed.candidates[0].content.parts[0].text
      if (text) {
        this.sendChunk({ chunk: text, res })
      }
    }
    
    // Handle LM Studio response
    if (parsed.choices?.[0]?.delta?.content) {
      const text = parsed.choices[0].delta.content
      if (text) {
        this.sendChunk({ chunk: text, res })
      }
    }
  }

  sendChunk({ chunk, res }) {
    const streamChunk = { chunk }
    res.write(`data: ${JSON.stringify(streamChunk)}\n\n`)
    
    if (res.flush) {
      res.flush()
    }
  }

  sendEndSignal({ res }) {
    const endChunk = { end: true }
    res.write(`data: ${JSON.stringify(endChunk)}\n\n`)
    
    if (res.flush) {
      res.flush()
    }
  }

  sendErrorSignal({ error, res }) {
    const errorChunk = { error }
    res.write(`data: ${JSON.stringify(errorChunk)}\n\n`)
    
    if (res.flush) {
      res.flush()
    }
  }

  async sendFallbackResponse({ lang, res }) {
    console.info('[INFO] Sending fallback response')
    
    const fallbackText = lang === 'en' 
      ? 'This analysis was generated using local calculations while AI services are unavailable.'
      : 'Phân tích này được tạo ra bằng các tính toán cục bộ khi dịch vụ AI không khả dụng.'
    
    const chunks = fallbackText.split(' ').map(word => word + ' ')
    
    for (let i = 0; i < chunks.length; i++) {
      this.sendChunk({ chunk: chunks[i], res })
      await new Promise(resolve => setTimeout(resolve, 30))
    }
    
    this.sendEndSignal({ res })
  }

  handleError({ error, res, timestamp }) {
    console.error(`[ERROR] [${timestamp}] Unhandled error:`, error.message)
    
    const errorChunk = { error: error.message }
    res.write(`data: ${JSON.stringify(errorChunk)}\n\n`)
    res.end()
  }
}

function createProcessDOBHandler({ config }) {
  return new ProcessDOBHandler({ config })
}

module.exports = { createProcessDOBHandler } 