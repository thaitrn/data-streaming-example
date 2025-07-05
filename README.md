# AI-Powered Date of Birth Insights with Streaming

A modern web application that provides comprehensive personal insights based on your date of birth using AI streaming technology.

## Features

- **Real-time AI Streaming**: Get insights as they're generated, not after completion
- **Multi-language Support**: English and Vietnamese
- **AI Provider Flexibility**: Support for both Gemini API and LM Studio
- **Comprehensive Analysis**: Age, zodiac, numerology, life stages, milestones, and shopping suggestions
- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Fallback Support**: Local calculations when AI services are unavailable

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server

**Option A: Use Gemini API (Recommended)**
```bash
# Set your Gemini API key
export GEMINI_API_KEY="your_gemini_api_key_here"

# Start the server
npm start
```

**Quick Setup with Script:**
```bash
# Run the setup script to check configuration
./setup-gemini.sh
```

**Option B: Use LM Studio (Local AI)**
```bash
# Start LM Studio first on localhost:1234
# Then start the server in LM Studio mode
npm run dev
```

**Option C: Local Fallback Only**
```bash
# Start without any AI provider (uses local calculations)
npm start
```

### 3. Open the Application
Visit `http://localhost:3000` in your browser.

## Configuration

### Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key (required for Gemini mode)
- `LM_DEV_MODE`: Set to `true` to use LM Studio instead of Gemini
- `PORT`: Server port (default: 3000)

### AI Providers

**Gemini API (Default)**
- Requires valid API key
- Supports real streaming
- More comprehensive AI analysis

**LM Studio (Local)**
- Requires LM Studio running on `localhost:1234`
- Simulated streaming (word-by-word)
- Good for development and privacy

**Local Fallback**
- No AI required
- Instant response
- Basic calculations only

## Usage

1. **Enter your date of birth** in the input field
2. **Click "Get My Insights"** to start the analysis
3. **Watch the AI stream** the response in real-time
4. **View comprehensive insights** including:
   - Basic information (age, zodiac, life stage)
   - Personality traits based on zodiac and numerology
   - Life cycle analysis and milestones
   - Interesting facts and historical events
   - Personalized shopping suggestions

## Technical Architecture

### Backend (`api/process-dob.js`)
- **SOLID Principles**: Service classes for business logic
- **Strategy Pattern**: AI provider abstraction
- **Streaming Support**: Real-time response streaming
- **Error Handling**: Graceful fallbacks and error recovery

### Frontend (`index.html`)
- **Modern UI**: Tailwind CSS with custom animations
- **Streaming Display**: Real-time text rendering with markdown support
- **Responsive Design**: Works on all device sizes
- **Progressive Enhancement**: Graceful degradation for older browsers

## API Endpoints

### GET `/api/process-dob`
**Parameters:**
- `dob`: Date of birth (YYYY-MM-DD format)
- `lang`: Language (`en` or `vi`)

**Response:** Server-Sent Events (SSE) stream with JSON chunks:
```json
{"chunk": "text content"}
{"end": true}
```

## Troubleshooting

### Common Issues

**"Cannot connect to server"**
- Ensure the server is running on port 3000
- Check if the port is available

**"Invalid date format"**
- Use YYYY-MM-DD format (e.g., 1990-01-01)
- Ensure the date is valid

**"AI service unavailable"**
- Check your API key (for Gemini)
- Ensure LM Studio is running (for local AI)
- The app will fall back to local calculations

**"Streaming not working"**
- Check browser console for errors
- Ensure your browser supports Server-Sent Events
- Try refreshing the page

### Development Mode

For development with LM Studio:
1. Start LM Studio and load a model
2. Set the API endpoint to `http://localhost:1234`
3. Run `npm run dev`
4. The app will use LM Studio for AI responses

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License - see package.json for details.

```curl -H "Content-Type: application/json" -d '{"contents":[{"parts":[{"text":"Test"}]}]}' "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=$GEMINI_API_KEY"

```curl -H "Authorization: Bearer $OPENAI_API_KEY" -H "Content-Type: application/json" -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"Test"}],"stream":true}' https://api.openai.com/v1/chat/completions

```curl -H "Authorization: Bearer $XAI_API_KEY" -H "Content-Type: application/json" -d '{"model":"grok-beta","messages":[{"role":"user","content":"Test"}]}' https://api.x.ai/v1/chat/completions