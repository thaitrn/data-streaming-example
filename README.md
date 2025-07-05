# AI DOB Streaming App

AI-powered Date of Birth analysis with streaming responses, built with TypeScript, Express, and modern best practices.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp env.example .env
```

Edit `.env` file:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# AI Provider Configuration
USE_GEMINI=0  # 0 for LM Studio, 1 for Gemini
GEMINI_API_KEY=your_gemini_api_key_here

# LM Studio Configuration
LM_STUDIO_URL=http://localhost:1234
LM_MODEL=local-model
```

3. **Start the service:**

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

**Build TypeScript:**
```bash
npm run build
```

## 📁 Project Structure

```
├── src/
│   ├── types/user.ts           # TypeScript interfaces
│   ├── services/
│   │   ├── DOBAnalyzer.ts     # Business logic
│   │   └── AIProvider.ts      # AI abstraction
│   ├── utils/
│   │   └── promptBuilder.ts   # Prompt utilities
│   ├── api/
│   │   └── process-dob.ts     # API handler
│   └── components/
│       ├── DOBForm.tsx        # Form component
│       └── DOBResults.tsx     # Results display
├── server.js                   # Express server
├── index.html                  # Frontend
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
└── .env                       # Environment variables
```

## 🔧 Configuration

### AI Providers

**LM Studio (Default):**
- Set `USE_GEMINI=0`
- Configure `LM_STUDIO_URL` and `LM_MODEL`
- Start LM Studio locally

**Gemini:**
- Set `USE_GEMINI=1`
- Add your `GEMINI_API_KEY`
- No local setup required

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `USE_GEMINI` | AI provider | 0 (LM Studio) |
| `GEMINI_API_KEY` | Gemini API key | - |
| `LM_STUDIO_URL` | LM Studio URL | http://localhost:1234 |
| `LM_MODEL` | LM Studio model | local-model |

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm start           # Start production server
npm run build       # Build TypeScript
npm test            # Run tests
npm run lint        # Lint code
npm run type-check  # TypeScript type checking
```

### API Endpoints

- `GET /` - Main application
- `GET /api/process-dob` - DOB analysis (SSE streaming)
- `GET /api/health` - Health check

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- UserProfile.test.tsx
```

## 🏗️ Architecture

### SOLID Principles
- **Single Responsibility**: Each class has one purpose
- **Open/Closed**: Extensible without modification
- **Liskov Substitution**: AI providers are interchangeable
- **Interface Segregation**: Clean interfaces
- **Dependency Inversion**: Depend on abstractions

### Design Patterns
- **Factory Pattern**: AI provider creation
- **Strategy Pattern**: Different AI providers
- **Observer Pattern**: Event streaming
- **Builder Pattern**: Prompt construction

### Error Handling
- Comprehensive error catching
- Graceful fallbacks
- User-friendly error messages
- Proper logging

## 🔒 Security

- Helmet.js for security headers
- CORS configuration
- Input validation
- Rate limiting ready
- Environment variable protection

## 📊 Monitoring

- Morgan logging
- Health check endpoint
- Error tracking
- Performance monitoring ready

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use:**
```bash
# Change port in .env
PORT=3001
```

2. **LM Studio not running:**
```bash
# Start LM Studio or use Gemini
USE_GEMINI=1
```

3. **TypeScript errors:**
```bash
npm run type-check
npm run build
```

4. **Missing dependencies:**
```bash
npm install
```

### Logs

Check server logs for:
- API requests
- Error messages
- AI provider status
- Performance metrics

## 📈 Performance

- Streaming responses
- Compression enabled
- Efficient state management
- Memory leak prevention
- Graceful shutdown

## 🤝 Contributing

1. Follow TypeScript best practices
2. Add tests for new features
3. Update documentation
4. Use conventional commits
5. Follow Cursor rules

## 📄 License

MIT License - see LICENSE file for details.

```curl -H "Content-Type: application/json" -d '{"contents":[{"parts":[{"text":"Test"}]}]}' "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=$GEMINI_API_KEY"

```curl -H "Authorization: Bearer $OPENAI_API_KEY" -H "Content-Type: application/json" -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"Test"}],"stream":true}' https://api.openai.com/v1/chat/completions

```curl -H "Authorization: Bearer $XAI_API_KEY" -H "Content-Type: application/json" -d '{"model":"grok-beta","messages":[{"role":"user","content":"Test"}]}' https://api.x.ai/v1/chat/completions