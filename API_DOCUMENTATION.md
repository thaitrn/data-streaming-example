# Data Streaming DOB Application - API Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Server Configuration](#server-configuration)
3. [Public APIs](#public-apis)
4. [Backend Classes and Functions](#backend-classes-and-functions)
5. [Frontend Components](#frontend-components)
6. [Configuration and Environment](#configuration-and-environment)
7. [Usage Examples](#usage-examples)
8. [Error Handling](#error-handling)

## Project Overview

The Data Streaming DOB Application is a real-time web application that analyzes dates of birth using AI models. It provides comprehensive insights including age calculations, zodiac signs, numerology, life stages, and personalized recommendations through streaming responses.

### Features
- Real-time streaming AI analysis
- Multi-language support (English/Vietnamese)
- Multiple AI provider support (Gemini AI, LM Studio)
- Comprehensive DOB analysis with multiple data points
- Responsive web interface with modern UI

---

## Server Configuration

### Express Server (`server.js`)

The main application server built with Express.js.

#### Configuration
```javascript
const PORT = process.env.PORT || 3000;
```

#### Middleware
- **CORS**: Enabled for cross-origin requests
- **JSON Parser**: For handling JSON request bodies
- **Static Files**: Serves static files from root directory

#### Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Serves main HTML page |
| `GET` | `/api/process-dob` | Main DOB analysis API |

#### Usage Example
```bash
# Start the server
npm start

# Development mode with LM Studio
npm run dev
```

---

## Public APIs

### `/api/process-dob`

Main API endpoint for processing date of birth and returning AI-powered insights.

#### Method
`GET`

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `dob` | string | Yes | Date of birth in YYYY-MM-DD format |
| `lang` | string | No | Language preference ('en' or 'vi'), defaults to 'vi' |

#### Response Format
Server-Sent Events (SSE) stream with JSON chunks:

```javascript
// Streaming chunk
data: {"chunk": "text content"}

// End of stream
data: {"end": true}

// Error response
data: {"error": "error message"}
```

#### Example Request
```javascript
// Using EventSource for streaming
const eventSource = new EventSource('/api/process-dob?dob=1990-05-15&lang=en');

eventSource.onmessage = function(event) {
    const data = JSON.parse(event.data);
    if (data.chunk) {
        console.log('Received chunk:', data.chunk);
    } else if (data.end) {
        console.log('Stream ended');
        eventSource.close();
    } else if (data.error) {
        console.error('Error:', data.error);
    }
};
```

#### Response Sections
The API returns structured markdown content with the following sections:
1. **Basic Information** - Age, zodiac sign, life stage
2. **Personality Traits** - Zodiac-based characteristics and numerology
3. **Life Cycle Analysis** - Current stage and milestones
4. **Interesting Facts** - Days lived, famous birthdays, historical events
5. **Shopping Suggestions** - Personalized recommendations based on zodiac and age

---

## Backend Classes and Functions

### DOBAnalyzer Class

Main class for analyzing date of birth data and extracting insights.

#### Constructor
```javascript
const analyzer = new DOBAnalyzer(dob);
```

**Parameters:**
- `dob` (string): Date of birth in YYYY-MM-DD format

#### Public Methods

##### `getAge()`
Calculates detailed age information.

**Returns:** Object with years, months, and days
```javascript
{
    years: 33,
    months: 7,
    days: 12
}
```

##### `getZodiacSign()`
Determines zodiac sign based on birth date.

**Returns:** String - Zodiac sign name
```javascript
"Taurus"
```

##### `getLifeStage()`
Determines current life stage based on age.

**Returns:** String - Life stage category
- "Childhood" (< 13 years)
- "Adolescence" (13-19 years)
- "Young Adult" (20-39 years)
- "Middle Age" (40-59 years)
- "Senior" (60+ years)

##### `getNumerology()`
Calculates numerology number from birth date.

**Returns:** Number (1-9)
```javascript
7
```

##### `getNumerologyFact(num)`
Gets personality insight based on numerology number.

**Parameters:**
- `num` (number): Numerology number (1-9)

**Returns:** String - Personality description

##### `getFamousBirthdays()`
Finds famous people born on the same date.

**Returns:** String - Names of celebrities or default message

##### `getHistoricalEvent(yearsAfter)`
Gets historical event from a specific year after birth.

**Parameters:**
- `yearsAfter` (number): Years to add to birth year

**Returns:** String - Historical event description

##### `getDaysOld()`
Calculates total days lived.

**Returns:** Number - Total days since birth

##### `getLifeMilestones()`
Gets age-appropriate life milestones.

**Returns:** Array of strings - Milestone descriptions

##### `getShoppingSuggestions(zodiac, age)`
Generates personalized shopping recommendations.

**Parameters:**
- `zodiac` (string): Zodiac sign
- `age` (number): Current age

**Returns:** Array of strings - Shopping suggestions

#### Usage Example
```javascript
const DOBAnalyzer = require('./api/process-dob');

const analyzer = new DOBAnalyzer('1990-05-15');
const age = analyzer.getAge();
const zodiac = analyzer.getZodiacSign();
const numerology = analyzer.getNumerology();

console.log(`Age: ${age.years} years, ${age.months} months, ${age.days} days`);
console.log(`Zodiac: ${zodiac}`);
console.log(`Numerology: ${numerology}`);
```

### AI Provider Classes

Abstract system for handling different AI providers.

#### AIProvider (Abstract Class)
Base class for AI providers.

```javascript
class AIProvider {
    async getResponse(prompt, lang, timestamp) {
        throw new Error('Not implemented');
    }
}
```

#### GeminiProvider
Implementation for Google Gemini AI.

```javascript
class GeminiProvider extends AIProvider {
    async getResponse(prompt, lang, timestamp) {
        // Gemini API integration
    }
}
```

**Requirements:**
- `GEMINI_API_KEY` environment variable

#### LMStudioProvider
Implementation for LM Studio local AI.

```javascript
class LMStudioProvider extends AIProvider {
    async getResponse(prompt, lang, timestamp) {
        // LM Studio API integration
    }
}
```

**Requirements:**
- LM Studio running locally
- `LM_STUDIO_URL` environment variable (optional, defaults to http://localhost:1234)

#### getAIProvider()
Factory function to get the appropriate AI provider.

**Returns:** AIProvider instance based on `USE_GEMINI` environment variable

```javascript
const provider = getAIProvider();
// Returns GeminiProvider if USE_GEMINI='1', else LMStudioProvider
```

### Utility Functions

#### `isValidDate(dateString)`
Validates date string format.

**Parameters:**
- `dateString` (string): Date to validate

**Returns:** Boolean - true if valid date

#### `constructAIPrompt(dob, age, zodiac, numerologyNum, lang)`
Constructs AI prompt with user data.

**Parameters:**
- `dob` (string): Date of birth
- `age` (object): Age details from getAge()
- `zodiac` (string): Zodiac sign
- `numerologyNum` (number): Numerology number
- `lang` (string): Language preference

**Returns:** String - Formatted prompt for AI

#### `generateLocalFallbackResponse(analyzer, lang)`
Generates local analysis when AI services are unavailable.

**Parameters:**
- `analyzer` (DOBAnalyzer): DOB analyzer instance
- `lang` (string): Language preference

**Returns:** String - Formatted markdown response

---

## Frontend Components

### Main Application Interface

#### HTML Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Modern responsive design with Tailwind CSS -->
    <!-- Custom fonts and animations -->
</head>
<body>
    <!-- Date input form -->
    <!-- Results display area -->
    <!-- Interactive cards for different analysis sections -->
</body>
</html>
```

#### CSS Classes and Styling

##### Key CSS Classes
- `.modern-btn` - Modern button styling with hover effects
- `.card` - Card container with hover animations
- `.markdown-content` - Styled content areas for AI responses
- `.pulse-highlight` - Animated highlight effect

##### Responsive Design
- Mobile-first approach
- Responsive grid system for analysis cards
- Touch-friendly interface elements

#### JavaScript Functions

##### `processDOB()`
Main function to handle DOB processing and streaming.

**Functionality:**
- Validates user input
- Initiates Server-Sent Events stream
- Handles real-time content updates
- Manages UI state during processing

```javascript
async function processDOB() {
    const dob = document.getElementById('dob').value;
    // Input validation
    // API call with EventSource
    // Real-time UI updates
}
```

##### `markdownToHtml(markdown)`
Converts markdown content to HTML using marked.js.

**Parameters:**
- `markdown` (string): Markdown content

**Returns:** String - HTML content

##### `setLang(lang)`
Updates interface language.

**Parameters:**
- `lang` (string): Language code ('en' or 'vi')

**Functionality:**
- Updates all UI text elements
- Maintains current state during language change

##### Event Handlers

###### Form Submission
```javascript
document.getElementById('submit').addEventListener('click', processDOB);
```

###### Date Input Validation
```javascript
document.getElementById('dob').max = (new Date()).toISOString().slice(0, 10);
```

###### Try Another Date
```javascript
document.getElementById('try-another').addEventListener('click', () => {
    // Reset form and UI state
});
```

### UI Components

#### Date Input Component
```html
<div class="mb-6 input-icon">
    <label for="dob" id="dob-label" class="block text-gray-700 font-semibold mb-2 text-lg">
        Enter Your Birth Date:
    </label>
    <input type="date" id="dob" class="w-full p-2 border rounded pl-10 text-lg" required>
    <div id="dob-error" class="input-error" style="display:none;"></div>
</div>
```

#### Analysis Cards
```html
<div id="basic-info-card" class="bg-indigo-50 p-6 rounded-xl shadow card">
    <h3 class="text-lg font-bold mb-2 text-indigo-700">
        <span class="icon">📋</span>Basic Information
    </h3>
    <div class="markdown-content" id="basic-info"></div>
</div>
```

#### Progress Indicators
```html
<div id="spinner" style="display:none;" class="flex justify-center mt-4">
    <div class="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-blue-500"></div>
</div>
```

---

## Configuration and Environment

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 3000 | Server port |
| `USE_GEMINI` | No | '0' | Use Gemini AI if '1', else LM Studio |
| `GEMINI_API_KEY` | Conditional | - | Required if USE_GEMINI='1' |
| `LM_STUDIO_URL` | No | http://localhost:1234 | LM Studio API URL |

### Package Dependencies

```json
{
  "dependencies": {
    "axios": "^1.10.0",
    "cors": "^2.8.5",
    "dotenv": "^17.0.1",
    "express": "^5.1.0",
    "openai": "^5.8.2"
  }
}
```

### Setup Instructions

1. **Clone and Install**
```bash
git clone <repository>
cd data-streaming-example
npm install
```

2. **Environment Configuration**
```bash
# Create .env file
echo "USE_GEMINI=1" > .env
echo "GEMINI_API_KEY=your_api_key_here" >> .env
```

3. **Run Application**
```bash
# Production mode with Gemini
npm start

# Development mode with LM Studio
npm run dev
```

---

## Usage Examples

### Basic Usage

#### Client-Side Integration
```html
<!DOCTYPE html>
<html>
<head>
    <title>DOB Analysis</title>
</head>
<body>
    <input type="date" id="dob">
    <button onclick="analyze()">Analyze</button>
    <div id="results"></div>

    <script>
    function analyze() {
        const dob = document.getElementById('dob').value;
        const eventSource = new EventSource(`/api/process-dob?dob=${dob}&lang=en`);
        
        eventSource.onmessage = function(event) {
            const data = JSON.parse(event.data);
            if (data.chunk) {
                document.getElementById('results').innerHTML += data.chunk;
            } else if (data.end) {
                eventSource.close();
            }
        };
    }
    </script>
</body>
</html>
```

#### Node.js Integration
```javascript
const axios = require('axios');

async function analyzeDOB(dob, lang = 'en') {
    try {
        const response = await axios.get(`http://localhost:3000/api/process-dob`, {
            params: { dob, lang },
            responseType: 'stream'
        });
        
        let result = '';
        response.data.on('data', chunk => {
            const lines = chunk.toString().split('\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = JSON.parse(line.slice(6));
                    if (data.chunk) result += data.chunk;
                }
            }
        });
        
        return result;
    } catch (error) {
        console.error('Analysis failed:', error);
    }
}

// Usage
analyzeDOB('1990-05-15', 'en').then(result => {
    console.log('Analysis complete:', result);
});
```

### Advanced Usage

#### Custom AI Provider
```javascript
class CustomAIProvider extends AIProvider {
    async getResponse(prompt, lang, timestamp) {
        // Custom AI implementation
        const response = await customAIService.chat({
            message: prompt,
            language: lang,
            stream: true
        });
        return response;
    }
}

// Register custom provider
function getAIProvider() {
    return new CustomAIProvider();
}
```

#### Extending DOBAnalyzer
```javascript
class ExtendedDOBAnalyzer extends DOBAnalyzer {
    constructor(dob) {
        super(dob);
    }
    
    getAstrologyChart() {
        // Custom astrology calculations
        return {
            sun: this.getZodiacSign(),
            moon: this.calculateMoonSign(),
            rising: this.calculateRisingSign()
        };
    }
    
    getCompatibility(otherDOB) {
        // Zodiac compatibility analysis
        const otherAnalyzer = new DOBAnalyzer(otherDOB);
        return this.compareZodiacSigns(this.getZodiacSign(), otherAnalyzer.getZodiacSign());
    }
}
```

---

## Error Handling

### API Error Responses

#### Invalid Date Format
```json
{
    "error": "Invalid date format"
}
```

#### Missing API Key
```json
{
    "error": "API access denied: Invalid or insufficient API key"
}
```

#### Rate Limiting
```json
{
    "error": "API quota exceeded. Check your usage limits"
}
```

#### Service Unavailable
When AI services are unavailable, the API automatically falls back to local analysis.

### Client-Side Error Handling

```javascript
const eventSource = new EventSource('/api/process-dob?dob=1990-05-15');

eventSource.addEventListener('error', function(event) {
    console.error('Connection failed:', event);
    // Implement retry logic or fallback
});

eventSource.onmessage = function(event) {
    try {
        const data = JSON.parse(event.data);
        if (data.error) {
            handleAPIError(data.error);
        }
    } catch (parseError) {
        console.error('Failed to parse response:', parseError);
    }
};

function handleAPIError(error) {
    // Display user-friendly error messages
    const errorElement = document.getElementById('error-display');
    errorElement.textContent = error;
    errorElement.style.display = 'block';
}
```

### Backend Error Handling

The application implements comprehensive error handling:

1. **Input Validation**: Validates date format and required parameters
2. **AI Service Fallback**: Automatically switches to local analysis when AI services fail
3. **Graceful Degradation**: Provides meaningful responses even when external services are unavailable
4. **Logging**: Comprehensive logging for debugging and monitoring

### Best Practices

1. **Always validate user input** before processing
2. **Implement timeout handling** for streaming connections
3. **Provide fallback content** when AI services are unavailable
4. **Handle network interruptions** gracefully
5. **Display progress indicators** during processing
6. **Cache results** when appropriate to reduce API calls

---

*This documentation covers all public APIs, functions, and components in the Data Streaming DOB Application. For additional support or questions, please refer to the source code or contact the development team.*