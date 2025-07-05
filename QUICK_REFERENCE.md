# Quick Reference Guide - DOB Application

## API Endpoints

### Main Analysis API
```
GET /api/process-dob?dob=YYYY-MM-DD&lang=en|vi
```
- **Response**: Server-Sent Events stream
- **Authentication**: None required
- **Rate Limiting**: Based on AI provider limits

## DOBAnalyzer Class Quick Reference

### Constructor
```javascript
const analyzer = new DOBAnalyzer('1990-05-15');
```

### Essential Methods
| Method | Returns | Description |
|--------|---------|-------------|
| `getAge()` | `{years, months, days}` | Detailed age calculation |
| `getZodiacSign()` | `string` | Zodiac sign name |
| `getLifeStage()` | `string` | Life stage category |
| `getNumerology()` | `number` | Numerology number (1-9) |
| `getDaysOld()` | `number` | Total days lived |
| `getShoppingSuggestions(zodiac, age)` | `string[]` | Personalized recommendations |

## Frontend Functions Quick Reference

### Core Functions
```javascript
// Main processing function
processDOB()

// Language switching
setLang('en' | 'vi')

// Markdown conversion
markdownToHtml(markdown)
```

### Event Handlers
```javascript
// Form submission
document.getElementById('submit').addEventListener('click', processDOB);

// Reset form
document.getElementById('try-another').addEventListener('click', resetForm);
```

## Environment Variables

```bash
# Required for Gemini
USE_GEMINI=1
GEMINI_API_KEY=your_key_here

# Optional
PORT=3000
LM_STUDIO_URL=http://localhost:1234
```

## Common Code Patterns

### EventSource Integration
```javascript
const es = new EventSource('/api/process-dob?dob=1990-05-15&lang=en');
es.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.chunk) console.log(data.chunk);
    if (data.end) es.close();
};
```

### AI Provider Factory
```javascript
const provider = getAIProvider();
// Returns GeminiProvider or LMStudioProvider based on USE_GEMINI
```

### Local Fallback
```javascript
const fallback = generateLocalFallbackResponse(analyzer, 'en');
// Returns formatted markdown when AI is unavailable
```

## CSS Classes Reference

### Button Styles
- `.modern-btn` - Primary button styling
- `.pulse-highlight` - Animated highlight effect

### Card Components
- `.card` - Base card styling with hover effects
- `.markdown-content` - Styled content areas

### Color Schemes
- **Basic Info**: `bg-indigo-50`, `text-indigo-700`
- **Personality**: `bg-teal-50`, `text-teal-700`
- **Life Cycle**: `bg-yellow-50`, `text-yellow-700`
- **Facts**: `bg-pink-50`, `text-pink-700`
- **Shopping**: `bg-green-50`, `text-green-700`

## Error Handling Quick Patterns

### API Errors
```javascript
if (data.error) {
    console.error('API Error:', data.error);
    // Handle specific error types
}
```

### Date Validation
```javascript
if (!isValidDate(dob)) {
    throw new Error('Invalid date format');
}
```

### Stream Connection Errors
```javascript
eventSource.onerror = (e) => {
    console.error('Stream error:', e);
    eventSource.close();
};
```

## Deployment Commands

```bash
# Install dependencies
npm install

# Start production server
npm start

# Start development server (LM Studio)
npm run dev

# Environment setup
echo "USE_GEMINI=1" > .env
echo "GEMINI_API_KEY=your_key" >> .env
```

## Testing Endpoints

```bash
# Test with curl
curl "http://localhost:3000/api/process-dob?dob=1990-05-15&lang=en"

# Test date validation
curl "http://localhost:3000/api/process-dob?dob=invalid-date"
```

## Common Issues & Solutions

### Issue: "Invalid date format"
**Solution**: Ensure date is in YYYY-MM-DD format

### Issue: "API access denied"
**Solution**: Check GEMINI_API_KEY in .env file

### Issue: Stream not working
**Solution**: Verify EventSource is properly implemented and connection is stable

### Issue: Local fallback not triggered
**Solution**: Check if AI provider is failing and fallback logic is enabled

## Performance Tips

1. **Cache results** for repeated requests
2. **Implement request debouncing** for real-time input
3. **Use connection pooling** for high traffic
4. **Monitor AI API quotas** to avoid rate limiting
5. **Optimize markdown rendering** for large responses

## Security Considerations

1. **Validate all inputs** on both client and server
2. **Sanitize markdown content** before rendering
3. **Rate limit API requests** to prevent abuse
4. **Secure API keys** in environment variables
5. **Use HTTPS** in production environments