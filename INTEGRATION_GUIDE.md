# Integration Guide - DOB Application

## Overview
This guide demonstrates how to integrate with, extend, and customize the Data Streaming DOB Application for various use cases and platforms.

## Table of Contents
1. [Basic Integration](#basic-integration)
2. [Advanced Integrations](#advanced-integrations)
3. [Custom AI Providers](#custom-ai-providers)
4. [Extending Analysis Features](#extending-analysis-features)
5. [Mobile Integration](#mobile-integration)
6. [API Gateway Integration](#api-gateway-integration)
7. [Database Integration](#database-integration)
8. [Real-time Dashboard](#real-time-dashboard)

---

## Basic Integration

### Embedding in Existing Website

#### Simple iFrame Integration
```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website with DOB Analysis</title>
</head>
<body>
    <div class="dob-widget">
        <iframe 
            src="http://localhost:3000" 
            width="100%" 
            height="800px"
            frameborder="0">
        </iframe>
    </div>
</body>
</html>
```

#### JavaScript Widget Integration
```html
<div id="dob-analysis-widget"></div>
<script>
class DOBWidget {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.apiUrl = options.apiUrl || 'http://localhost:3000';
        this.language = options.language || 'en';
        this.theme = options.theme || 'default';
        this.init();
    }
    
    init() {
        this.render();
        this.attachEvents();
    }
    
    render() {
        this.container.innerHTML = `
            <div class="dob-widget ${this.theme}">
                <h3>Birth Date Analysis</h3>
                <input type="date" id="widget-dob" class="dob-input">
                <button id="widget-analyze" class="analyze-btn">Analyze</button>
                <div id="widget-results" class="results-area"></div>
            </div>
        `;
    }
    
    attachEvents() {
        const analyzeBtn = this.container.querySelector('#widget-analyze');
        analyzeBtn.addEventListener('click', () => this.analyze());
    }
    
    async analyze() {
        const dob = this.container.querySelector('#widget-dob').value;
        if (!dob) return;
        
        const eventSource = new EventSource(
            `${this.apiUrl}/api/process-dob?dob=${dob}&lang=${this.language}`
        );
        
        const resultsArea = this.container.querySelector('#widget-results');
        resultsArea.innerHTML = '<div class="loading">Analyzing...</div>';
        
        let content = '';
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.chunk) {
                content += data.chunk;
                resultsArea.innerHTML = this.formatContent(content);
            } else if (data.end) {
                eventSource.close();
            } else if (data.error) {
                resultsArea.innerHTML = `<div class="error">${data.error}</div>`;
                eventSource.close();
            }
        };
    }
    
    formatContent(markdown) {
        // Basic markdown to HTML conversion
        return markdown
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }
}

// Initialize widget
const dobWidget = new DOBWidget('dob-analysis-widget', {
    apiUrl: 'http://localhost:3000',
    language: 'en',
    theme: 'modern'
});
</script>
```

### React Component Integration

```jsx
import React, { useState, useEffect } from 'react';

const DOBAnalysisComponent = ({ apiUrl = 'http://localhost:3000', language = 'en' }) => {
    const [dob, setDob] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const analyzeDate = async () => {
        if (!dob) return;
        
        setIsLoading(true);
        setError('');
        setAnalysis('');
        
        try {
            const eventSource = new EventSource(
                `${apiUrl}/api/process-dob?dob=${dob}&lang=${language}`
            );
            
            let content = '';
            eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.chunk) {
                    content += data.chunk;
                    setAnalysis(content);
                } else if (data.end) {
                    setIsLoading(false);
                    eventSource.close();
                } else if (data.error) {
                    setError(data.error);
                    setIsLoading(false);
                    eventSource.close();
                }
            };
            
            eventSource.onerror = () => {
                setError('Connection failed');
                setIsLoading(false);
                eventSource.close();
            };
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="dob-analysis">
            <div className="input-section">
                <label>Date of Birth:</label>
                <input 
                    type="date" 
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                />
                <button onClick={analyzeDate} disabled={isLoading || !dob}>
                    {isLoading ? 'Analyzing...' : 'Analyze'}
                </button>
            </div>
            
            {error && <div className="error">{error}</div>}
            
            {analysis && (
                <div 
                    className="analysis-results" 
                    dangerouslySetInnerHTML={{ __html: formatMarkdown(analysis) }}
                />
            )}
        </div>
    );
};

const formatMarkdown = (text) => {
    return text
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
};

export default DOBAnalysisComponent;
```

---

## Advanced Integrations

### Node.js Backend Integration

```javascript
const express = require('express');
const axios = require('axios');
const DOBAnalyzer = require('./path/to/dob-analyzer');

class DOBService {
    constructor(options = {}) {
        this.apiUrl = options.apiUrl || 'http://localhost:3000';
        this.cacheEnabled = options.cache || false;
        this.cache = new Map();
    }
    
    async analyzeDate(dob, language = 'en', options = {}) {
        const cacheKey = `${dob}-${language}`;
        
        // Check cache first
        if (this.cacheEnabled && this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        try {
            // Option 1: Use local analysis
            if (options.useLocal) {
                const result = await this.getLocalAnalysis(dob, language);
                if (this.cacheEnabled) {
                    this.cache.set(cacheKey, result);
                }
                return result;
            }
            
            // Option 2: Use streaming API
            const result = await this.getStreamingAnalysis(dob, language);
            if (this.cacheEnabled) {
                this.cache.set(cacheKey, result);
            }
            return result;
        } catch (error) {
            // Fallback to local analysis
            return await this.getLocalAnalysis(dob, language);
        }
    }
    
    async getLocalAnalysis(dob, language) {
        const analyzer = new DOBAnalyzer(dob);
        
        const data = {
            age: analyzer.getAge(),
            zodiac: analyzer.getZodiacSign(),
            lifeStage: analyzer.getLifeStage(),
            numerology: analyzer.getNumerology(),
            daysOld: analyzer.getDaysOld(),
            milestones: analyzer.getLifeMilestones(),
            shopping: analyzer.getShoppingSuggestions(analyzer.getZodiacSign(), analyzer.getAge().years)
        };
        
        return {
            success: true,
            data,
            source: 'local'
        };
    }
    
    async getStreamingAnalysis(dob, language) {
        return new Promise((resolve, reject) => {
            const response = axios({
                method: 'get',
                url: `${this.apiUrl}/api/process-dob`,
                params: { dob, lang: language },
                responseType: 'stream'
            });
            
            let content = '';
            response.then(res => {
                res.data.on('data', chunk => {
                    const lines = chunk.toString().split('\n');
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                if (data.chunk) content += data.chunk;
                                if (data.end) {
                                    resolve({
                                        success: true,
                                        content,
                                        source: 'api'
                                    });
                                }
                                if (data.error) {
                                    reject(new Error(data.error));
                                }
                            } catch (e) {
                                // Ignore malformed JSON
                            }
                        }
                    }
                });
                
                res.data.on('error', reject);
            }).catch(reject);
        });
    }
}

// Usage in Express app
const app = express();
const dobService = new DOBService({ cache: true });

app.get('/analyze/:dob', async (req, res) => {
    try {
        const { dob } = req.params;
        const { lang = 'en', local = false } = req.query;
        
        const result = await dobService.analyzeDate(dob, lang, { useLocal: local });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

### Python Integration

```python
import requests
import asyncio
import aiohttp
from typing import Optional, Dict, Any
import json

class DOBAnalyzer:
    def __init__(self, api_url: str = "http://localhost:3000"):
        self.api_url = api_url
        
    async def analyze_date(self, dob: str, language: str = "en") -> Dict[str, Any]:
        """
        Analyze date of birth using the streaming API
        """
        url = f"{self.api_url}/api/process-dob"
        params = {"dob": dob, "lang": language}
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params) as response:
                    if response.status != 200:
                        raise Exception(f"API request failed: {response.status}")
                    
                    content = ""
                    async for line in response.content:
                        line_str = line.decode('utf-8').strip()
                        if line_str.startswith('data: '):
                            try:
                                data = json.loads(line_str[6:])
                                if 'chunk' in data:
                                    content += data['chunk']
                                elif 'end' in data:
                                    break
                                elif 'error' in data:
                                    raise Exception(data['error'])
                            except json.JSONDecodeError:
                                continue
                    
                    return {
                        "success": True,
                        "content": content,
                        "dob": dob,
                        "language": language
                    }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "dob": dob,
                "language": language
            }

# Usage example
async def main():
    analyzer = DOBAnalyzer()
    result = await analyzer.analyze_date("1990-05-15", "en")
    
    if result["success"]:
        print("Analysis successful:")
        print(result["content"])
    else:
        print(f"Analysis failed: {result['error']}")

# Run the analyzer
asyncio.run(main())
```

---

## Custom AI Providers

### OpenAI Integration

```javascript
const OpenAI = require('openai');

class OpenAIProvider extends AIProvider {
    constructor() {
        super();
        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }
    
    async getResponse(prompt, lang, timestamp) {
        console.info(`[${timestamp}] [OPENAI] Sending request to OpenAI API...`);
        
        try {
            const stream = await this.client.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are an AI that analyzes dates of birth and provides comprehensive insights. Use markdown formatting for better readability."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                stream: true,
                temperature: 0.7,
                max_tokens: 2000
            });
            
            // Convert OpenAI stream to Express response format
            return this.convertOpenAIStream(stream);
        } catch (error) {
            console.error('[ERROR] OpenAI Provider error:', error);
            throw error;
        }
    }
    
    convertOpenAIStream(stream) {
        // Create a readable stream compatible with Express response
        const { PassThrough } = require('stream');
        const passThrough = new PassThrough();
        
        (async () => {
            try {
                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content || '';
                    if (content) {
                        const data = `data: ${JSON.stringify({ chunk: content })}\n\n`;
                        passThrough.write(data);
                    }
                }
                passThrough.write('data: {"end": true}\n\n');
                passThrough.end();
            } catch (error) {
                const errorData = `data: ${JSON.stringify({ error: error.message })}\n\n`;
                passThrough.write(errorData);
                passThrough.end();
            }
        })();
        
        return { data: passThrough };
    }
}

// Register the provider
function getAIProvider() {
    const provider = process.env.AI_PROVIDER || 'openai';
    switch (provider) {
        case 'openai':
            return new OpenAIProvider();
        case 'gemini':
            return new GeminiProvider();
        case 'lmstudio':
        default:
            return new LMStudioProvider();
    }
}
```

### Anthropic Claude Integration

```javascript
const Anthropic = require('@anthropic-ai/sdk');

class ClaudeProvider extends AIProvider {
    constructor() {
        super();
        this.anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });
    }
    
    async getResponse(prompt, lang, timestamp) {
        console.info(`[${timestamp}] [CLAUDE] Sending request to Claude API...`);
        
        try {
            const stream = await this.anthropic.messages.create({
                model: "claude-3-sonnet-20240229",
                max_tokens: 2000,
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                stream: true
            });
            
            return this.convertClaudeStream(stream);
        } catch (error) {
            console.error('[ERROR] Claude Provider error:', error);
            throw error;
        }
    }
    
    convertClaudeStream(stream) {
        const { PassThrough } = require('stream');
        const passThrough = new PassThrough();
        
        (async () => {
            try {
                for await (const event of stream) {
                    if (event.type === 'content_block_delta') {
                        const content = event.delta.text || '';
                        if (content) {
                            const data = `data: ${JSON.stringify({ chunk: content })}\n\n`;
                            passThrough.write(data);
                        }
                    } else if (event.type === 'message_stop') {
                        passThrough.write('data: {"end": true}\n\n');
                        break;
                    }
                }
                passThrough.end();
            } catch (error) {
                const errorData = `data: ${JSON.stringify({ error: error.message })}\n\n`;
                passThrough.write(errorData);
                passThrough.end();
            }
        })();
        
        return { data: passThrough };
    }
}
```

---

## Extending Analysis Features

### Custom Analysis Modules

```javascript
class AstrologyAnalyzer extends DOBAnalyzer {
    constructor(dob, birthTime = null, location = null) {
        super(dob);
        this.birthTime = birthTime;
        this.location = location;
    }
    
    getDetailedAstrologyChart() {
        return {
            sun: this.getSunSign(),
            moon: this.getMoonSign(),
            rising: this.getRisingSign(),
            venus: this.getVenusSign(),
            mars: this.getMarsSign(),
            houses: this.getHouses(),
            aspects: this.getAspects()
        };
    }
    
    getSunSign() {
        // Enhanced zodiac calculation
        return {
            sign: this.getZodiacSign(),
            element: this.getElement(),
            quality: this.getQuality(),
            ruler: this.getRulingPlanet()
        };
    }
    
    getMoonSign() {
        if (!this.birthTime) return null;
        // Calculate moon sign based on birth time
        // This would require ephemeris data
        return this.calculateMoonPosition();
    }
    
    getRisingSign() {
        if (!this.birthTime || !this.location) return null;
        // Calculate rising sign based on time and location
        return this.calculateAscendant();
    }
    
    getCompatibility(otherDOB, otherTime = null, otherLocation = null) {
        const other = new AstrologyAnalyzer(otherDOB, otherTime, otherLocation);
        
        return {
            overall: this.calculateOverallCompatibility(other),
            romantic: this.calculateRomanticCompatibility(other),
            friendship: this.calculateFriendshipCompatibility(other),
            business: this.calculateBusinessCompatibility(other),
            synastry: this.calculateSynastry(other)
        };
    }
}

class PersonalityAnalyzer extends DOBAnalyzer {
    getPersonalityProfile() {
        const zodiac = this.getZodiacSign();
        const numerology = this.getNumerology();
        const lifeStage = this.getLifeStage();
        
        return {
            coreTraits: this.getCoreTraits(zodiac),
            strengths: this.getStrengths(zodiac, numerology),
            challenges: this.getChallenges(zodiac, numerology),
            lifeGoals: this.getLifeGoals(lifeStage),
            careerSuggestions: this.getCareerSuggestions(zodiac, numerology),
            relationshipStyle: this.getRelationshipStyle(zodiac),
            communicationStyle: this.getCommunicationStyle(zodiac, numerology)
        };
    }
    
    getCoreTraits(zodiac) {
        const traits = {
            'Aries': ['Independent', 'Energetic', 'Pioneering', 'Impulsive'],
            'Taurus': ['Reliable', 'Patient', 'Practical', 'Stubborn'],
            'Gemini': ['Adaptable', 'Curious', 'Communicative', 'Inconsistent'],
            // ... continue for all signs
        };
        return traits[zodiac] || [];
    }
}
```

### Health and Wellness Module

```javascript
class WellnessAnalyzer extends DOBAnalyzer {
    getHealthInsights() {
        const zodiac = this.getZodiacSign();
        const age = this.getAge().years;
        const lifeStage = this.getLifeStage();
        
        return {
            constitution: this.getConstitutionType(zodiac),
            vulnerabilities: this.getHealthVulnerabilities(zodiac),
            recommendations: this.getWellnessRecommendations(zodiac, age),
            idealDiet: this.getDietaryRecommendations(zodiac),
            exerciseStyle: this.getExerciseRecommendations(zodiac),
            stressManagement: this.getStressManagementTips(zodiac),
            sleepPattern: this.getSleepRecommendations(zodiac),
            preventiveCare: this.getPreventiveCareSchedule(age, lifeStage)
        };
    }
    
    getConstitutionType(zodiac) {
        // Based on traditional astrology and Ayurveda
        const constitutions = {
            'Aries': 'Pitta-dominant (Fire)',
            'Taurus': 'Kapha-dominant (Earth)',
            'Gemini': 'Vata-dominant (Air)',
            // ... continue
        };
        return constitutions[zodiac];
    }
    
    getBiorhythms() {
        const birthDate = this.birthDate;
        const today = this.today;
        const daysSinceBirth = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
        
        return {
            physical: this.calculateBiorhythm(daysSinceBirth, 23),
            emotional: this.calculateBiorhythm(daysSinceBirth, 28),
            intellectual: this.calculateBiorhythm(daysSinceBirth, 33),
            intuitive: this.calculateBiorhythm(daysSinceBirth, 38)
        };
    }
    
    calculateBiorhythm(days, cycle) {
        return Math.sin((2 * Math.PI * days) / cycle);
    }
}
```

---

## Mobile Integration

### React Native Component

```jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';

const DOBAnalysisScreen = () => {
    const [dob, setDob] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const analyzeDate = async () => {
        if (!dob) {
            Alert.alert('Error', 'Please enter a valid date');
            return;
        }

        setIsLoading(true);
        setAnalysis('');

        try {
            // Note: React Native doesn't support EventSource natively
            // Use a WebSocket or polling approach instead
            const response = await fetch(`http://localhost:3000/api/process-dob?dob=${dob}&lang=en`);
            const reader = response.body.getReader();
            
            let content = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = new TextDecoder().decode(value);
                const lines = chunk.split('\n');
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.chunk) {
                                content += data.chunk;
                                setAnalysis(content);
                            } else if (data.end) {
                                setIsLoading(false);
                                return;
                            }
                        } catch (e) {
                            // Ignore parsing errors
                        }
                    }
                }
            }
        } catch (error) {
            Alert.alert('Error', error.message);
            setIsLoading(false);
        }
    };

    return (
        <ScrollView style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
                Birth Date Analysis
            </Text>
            
            <TextInput
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    marginBottom: 20,
                    borderRadius: 5
                }}
                placeholder="Enter date (YYYY-MM-DD)"
                value={dob}
                onChangeText={setDob}
            />
            
            <TouchableOpacity
                style={{
                    backgroundColor: '#007AFF',
                    padding: 15,
                    borderRadius: 5,
                    alignItems: 'center',
                    marginBottom: 20
                }}
                onPress={analyzeDate}
                disabled={isLoading}
            >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    {isLoading ? 'Analyzing...' : 'Analyze'}
                </Text>
            </TouchableOpacity>
            
            {analysis ? (
                <View style={{ padding: 15, backgroundColor: '#f5f5f5', borderRadius: 5 }}>
                    <Text>{analysis}</Text>
                </View>
            ) : null}
        </ScrollView>
    );
};

export default DOBAnalysisScreen;
```

### Flutter Integration

```dart
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class DOBAnalysisWidget extends StatefulWidget {
  @override
  _DOBAnalysisWidgetState createState() => _DOBAnalysisWidgetState();
}

class _DOBAnalysisWidgetState extends State<DOBAnalysisWidget> {
  final TextEditingController _dobController = TextEditingController();
  String _analysis = '';
  bool _isLoading = false;
  
  Future<void> _analyzeDate() async {
    if (_dobController.text.isEmpty) return;
    
    setState(() {
      _isLoading = true;
      _analysis = '';
    });
    
    try {
      final uri = Uri.parse('http://localhost:3000/api/process-dob')
          .replace(queryParameters: {
        'dob': _dobController.text,
        'lang': 'en'
      });
      
      final request = http.Request('GET', uri);
      final response = await request.send();
      
      if (response.statusCode == 200) {
        String content = '';
        await response.stream.transform(utf8.decoder).forEach((chunk) {
          final lines = chunk.split('\n');
          for (final line in lines) {
            if (line.startsWith('data: ')) {
              try {
                final data = jsonDecode(line.substring(6));
                if (data['chunk'] != null) {
                  content += data['chunk'];
                  setState(() {
                    _analysis = content;
                  });
                } else if (data['end'] != null) {
                  setState(() {
                    _isLoading = false;
                  });
                  return;
                }
              } catch (e) {
                // Ignore parsing errors
              }
            }
          }
        });
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: ${e.toString()}')),
      );
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          TextField(
            controller: _dobController,
            decoration: InputDecoration(
              labelText: 'Date of Birth (YYYY-MM-DD)',
              border: OutlineInputBorder(),
            ),
          ),
          SizedBox(height: 16),
          ElevatedButton(
            onPressed: _isLoading ? null : _analyzeDate,
            child: Text(_isLoading ? 'Analyzing...' : 'Analyze'),
          ),
          SizedBox(height: 16),
          if (_analysis.isNotEmpty)
            Expanded(
              child: SingleChildScrollView(
                child: Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Text(_analysis),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
```

---

## API Gateway Integration

### AWS API Gateway + Lambda

```javascript
// lambda-handler.js
const DOBAnalyzer = require('./dob-analyzer');

exports.handler = async (event, context) => {
    const { dob, lang = 'en' } = event.queryStringParameters || {};
    
    if (!dob) {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Missing dob parameter' })
        };
    }
    
    try {
        const analyzer = new DOBAnalyzer(dob);
        
        const analysis = {
            age: analyzer.getAge(),
            zodiac: analyzer.getZodiacSign(),
            lifeStage: analyzer.getLifeStage(),
            numerology: analyzer.getNumerology(),
            daysOld: analyzer.getDaysOld(),
            milestones: analyzer.getLifeMilestones(),
            shopping: analyzer.getShoppingSuggestions(
                analyzer.getZodiacSign(), 
                analyzer.getAge().years
            ),
            famous: analyzer.getFamousBirthdays(),
            timestamp: new Date().toISOString()
        };
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                data: analysis,
                language: lang
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                success: false, 
                error: error.message 
            })
        };
    }
};
```

### Google Cloud Functions

```javascript
const functions = require('@google-cloud/functions-framework');
const DOBAnalyzer = require('./dob-analyzer');

functions.http('analyzeDOB', (req, res) => {
    // Enable CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    
    const { dob, lang = 'en' } = req.query;
    
    if (!dob) {
        res.status(400).json({ error: 'Missing dob parameter' });
        return;
    }
    
    try {
        const analyzer = new DOBAnalyzer(dob);
        
        const analysis = {
            age: analyzer.getAge(),
            zodiac: analyzer.getZodiacSign(),
            lifeStage: analyzer.getLifeStage(),
            numerology: analyzer.getNumerology(),
            daysOld: analyzer.getDaysOld()
        };
        
        res.json({
            success: true,
            data: analysis,
            language: lang,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
```

---

## Database Integration

### MongoDB Integration

```javascript
const mongoose = require('mongoose');

// Analysis result schema
const analysisSchema = new mongoose.Schema({
    dob: { type: Date, required: true },
    userId: { type: String, required: false },
    language: { type: String, default: 'en' },
    analysis: {
        age: {
            years: Number,
            months: Number,
            days: Number
        },
        zodiac: String,
        lifeStage: String,
        numerology: Number,
        content: String
    },
    aiProvider: String,
    createdAt: { type: Date, default: Date.now },
    accessedAt: { type: Date, default: Date.now }
});

analysisSchema.index({ dob: 1, language: 1 });
analysisSchema.index({ userId: 1 });
analysisSchema.index({ createdAt: -1 });

const Analysis = mongoose.model('Analysis', analysisSchema);

class DOBDatabase {
    static async saveAnalysis(dob, analysis, options = {}) {
        try {
            const existing = await Analysis.findOne({
                dob: new Date(dob),
                language: options.language || 'en'
            });
            
            if (existing) {
                existing.accessedAt = new Date();
                existing.analysis = analysis;
                return await existing.save();
            } else {
                return await Analysis.create({
                    dob: new Date(dob),
                    userId: options.userId,
                    language: options.language || 'en',
                    analysis,
                    aiProvider: options.provider || 'local'
                });
            }
        } catch (error) {
            console.error('Database save error:', error);
            throw error;
        }
    }
    
    static async getAnalysis(dob, language = 'en') {
        try {
            const analysis = await Analysis.findOne({
                dob: new Date(dob),
                language
            });
            
            if (analysis) {
                analysis.accessedAt = new Date();
                await analysis.save();
            }
            
            return analysis;
        } catch (error) {
            console.error('Database fetch error:', error);
            return null;
        }
    }
    
    static async getUserAnalyses(userId, limit = 10) {
        try {
            return await Analysis.find({ userId })
                .sort({ createdAt: -1 })
                .limit(limit);
        } catch (error) {
            console.error('Database fetch error:', error);
            return [];
        }
    }
    
    static async getPopularDates(limit = 10) {
        try {
            return await Analysis.aggregate([
                {
                    $group: {
                        _id: '$dob',
                        count: { $sum: 1 },
                        lastAccessed: { $max: '$accessedAt' }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: limit }
            ]);
        } catch (error) {
            console.error('Database aggregation error:', error);
            return [];
        }
    }
}

// Enhanced API endpoint with database integration
app.get('/api/process-dob', async (req, res) => {
    const { dob, lang = 'vi', userId, useCache = true } = req.query;
    
    // Check cache first
    if (useCache) {
        const cached = await DOBDatabase.getAnalysis(dob, lang);
        if (cached) {
            res.json({
                success: true,
                data: cached.analysis,
                cached: true,
                timestamp: cached.createdAt
            });
            return;
        }
    }
    
    // Continue with regular processing...
    // Then save to database
    try {
        const analyzer = new DOBAnalyzer(dob);
        const analysis = {
            age: analyzer.getAge(),
            zodiac: analyzer.getZodiacSign(),
            // ... other analysis data
        };
        
        await DOBDatabase.saveAnalysis(dob, analysis, {
            userId,
            language: lang,
            provider: 'local'
        });
        
        res.json({
            success: true,
            data: analysis,
            cached: false
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

---

## Real-time Dashboard

### WebSocket Dashboard

```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

class AnalyticsTracker {
    constructor() {
        this.activeConnections = 0;
        this.totalAnalyses = 0;
        this.recentAnalyses = [];
        this.popularZodiacs = new Map();
        this.languageStats = new Map();
    }
    
    trackAnalysis(dob, zodiac, language) {
        this.totalAnalyses++;
        this.recentAnalyses.unshift({
            dob,
            zodiac,
            language,
            timestamp: new Date()
        });
        
        // Keep only recent 100 analyses
        if (this.recentAnalyses.length > 100) {
            this.recentAnalyses.pop();
        }
        
        // Update zodiac stats
        this.popularZodiacs.set(
            zodiac, 
            (this.popularZodiacs.get(zodiac) || 0) + 1
        );
        
        // Update language stats
        this.languageStats.set(
            language,
            (this.languageStats.get(language) || 0) + 1
        );
        
        this.broadcastUpdate();
    }
    
    getStats() {
        return {
            activeConnections: this.activeConnections,
            totalAnalyses: this.totalAnalyses,
            recentAnalyses: this.recentAnalyses.slice(0, 10),
            popularZodiacs: Array.from(this.popularZodiacs.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5),
            languageStats: Array.from(this.languageStats.entries()),
            timestamp: new Date()
        };
    }
    
    broadcastUpdate() {
        const stats = this.getStats();
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'stats_update',
                    data: stats
                }));
            }
        });
    }
}

const analytics = new AnalyticsTracker();

wss.on('connection', (ws) => {
    analytics.activeConnections++;
    
    // Send initial stats
    ws.send(JSON.stringify({
        type: 'initial_stats',
        data: analytics.getStats()
    }));
    
    ws.on('close', () => {
        analytics.activeConnections--;
    });
});

// Dashboard HTML
const dashboardHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>DOB Analytics Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .stat-card { background: #f5f5f5; padding: 20px; border-radius: 8px; }
        .stat-number { font-size: 2em; font-weight: bold; color: #2563eb; }
    </style>
</head>
<body>
    <h1>DOB Analysis Dashboard</h1>
    
    <div class="stats-grid">
        <div class="stat-card">
            <h3>Active Connections</h3>
            <div class="stat-number" id="active-connections">0</div>
        </div>
        
        <div class="stat-card">
            <h3>Total Analyses</h3>
            <div class="stat-number" id="total-analyses">0</div>
        </div>
        
        <div class="stat-card">
            <h3>Popular Zodiacs</h3>
            <canvas id="zodiac-chart" width="300" height="200"></canvas>
        </div>
        
        <div class="stat-card">
            <h3>Recent Analyses</h3>
            <div id="recent-analyses"></div>
        </div>
    </div>
    
    <script>
        const ws = new WebSocket('ws://localhost:8080');
        let zodiacChart;
        
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'stats_update' || message.type === 'initial_stats') {
                updateDashboard(message.data);
            }
        };
        
        function updateDashboard(stats) {
            document.getElementById('active-connections').textContent = stats.activeConnections;
            document.getElementById('total-analyses').textContent = stats.totalAnalyses;
            
            // Update recent analyses
            const recentDiv = document.getElementById('recent-analyses');
            recentDiv.innerHTML = stats.recentAnalyses
                .map(analysis => \`<div>\${analysis.zodiac} - \${analysis.language} (\${new Date(analysis.timestamp).toLocaleTimeString()})</div>\`)
                .join('');
            
            // Update zodiac chart
            updateZodiacChart(stats.popularZodiacs);
        }
        
        function updateZodiacChart(zodiacData) {
            const ctx = document.getElementById('zodiac-chart').getContext('2d');
            
            if (zodiacChart) {
                zodiacChart.destroy();
            }
            
            zodiacChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: zodiacData.map(item => item[0]),
                    datasets: [{
                        data: zodiacData.map(item => item[1]),
                        backgroundColor: [
                            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                            '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    </script>
</body>
</html>
`;

app.get('/dashboard', (req, res) => {
    res.send(dashboardHTML);
});
```

This comprehensive integration guide provides developers with multiple approaches to integrate, extend, and customize the DOB application for various platforms and use cases. Each integration example includes practical code that can be directly implemented or adapted for specific requirements.