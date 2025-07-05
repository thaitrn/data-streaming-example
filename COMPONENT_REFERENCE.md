# Component Reference Guide - Frontend Components

## Overview
This document provides detailed reference for all frontend UI components, their properties, states, and interactions in the DOB Application.

## Form Components

### Date Input Component

#### HTML Structure
```html
<div class="mb-6 input-icon">
    <label for="dob" id="dob-label" class="block text-gray-700 font-semibold mb-2 text-lg">
        Enter Your Birth Date:
    </label>
    <input type="date" id="dob" class="w-full p-2 border rounded pl-10 text-lg" required>
    <div id="dob-error" class="input-error" style="display:none;"></div>
</div>
```

#### Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | string | 'date' | HTML5 date input type |
| `required` | boolean | true | Field validation requirement |
| `max` | string | current date | Maximum selectable date |

#### States
- **Empty**: No date selected
- **Valid**: Date in YYYY-MM-DD format
- **Invalid**: Triggers error display
- **Disabled**: During processing

#### Events
```javascript
// Date selection
document.getElementById('dob').addEventListener('change', validateDate);

// Form submission prevention for invalid dates
document.getElementById('dob').addEventListener('input', clearErrors);
```

### Submit Button Component

#### HTML Structure
```html
<button id="submit" class="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 text-lg font-semibold transition">
    Get My Insights
</button>
```

#### States
- **Idle**: Ready for user interaction
- **Processing**: Disabled with spinner
- **Error**: Re-enabled after error

#### Properties
| Property | Value | Description |
|----------|-------|-------------|
| `disabled` | boolean | Prevents multiple submissions |
| `textContent` | string | Changes based on processing state |

## Display Components

### Loading Spinner

#### HTML Structure
```html
<div id="spinner" style="display:none;" class="flex justify-center mt-4">
    <div class="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-blue-500"></div>
</div>
```

#### CSS Animation
```css
.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
```

### AI Status Indicator

#### HTML Structure
```html
<div id="ai-status" class="flex items-center gap-2 text-blue-500 text-lg font-semibold">
    <span id="ai-status-text">AI đang phân tích...</span>
    <span id="ai-dots" class="inline-block">
        <span class="dot">.</span>
        <span class="dot">.</span>
        <span class="dot">.</span>
    </span>
</div>
```

#### Animation States
```css
#ai-dots .dot {
    animation: blink 1.2s infinite both;
}
#ai-dots .dot:nth-child(2) { animation-delay: 0.2s; }
#ai-dots .dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes blink {
    0%, 80%, 100% { opacity: 0; }
    40% { opacity: 1; }
}
```

## Analysis Card Components

### Base Card Structure

#### HTML Template
```html
<div id="{section}-card" class="bg-{color}-50 p-6 rounded-xl shadow card">
    <h3 class="text-lg font-bold mb-2 text-{color}-700">
        <span class="icon">{emoji}</span>{title}
    </h3>
    <div class="markdown-content" id="{section}"></div>
</div>
```

#### Card Variants

##### Basic Information Card
```html
<div id="basic-info-card" class="bg-indigo-50 p-6 rounded-xl shadow card">
    <h3 class="text-lg font-bold mb-2 text-indigo-700">
        <span class="icon">📋</span>Basic Information
    </h3>
    <div class="markdown-content" id="basic-info"></div>
</div>
```

##### Personality Traits Card
```html
<div id="personality-traits-card" class="bg-teal-50 p-6 rounded-b-xl shadow card hidden">
    <h3 class="text-lg font-bold mb-2 text-teal-700">
        <span class="icon">🧠</span>Your Personality Traits
    </h3>
    <div class="markdown-content" id="personality-traits"></div>
</div>
```

##### Life Cycle Card
```html
<div id="life-cycle-card" class="bg-yellow-50 p-6 rounded-b-xl shadow card hidden">
    <h3 class="text-lg font-bold mb-2 text-yellow-700">
        <span class="icon">🌱</span>Life Cycle Analysis
    </h3>
    <div class="markdown-content" id="life-cycle"></div>
</div>
```

##### Interesting Facts Card
```html
<div id="interesting-facts-card" class="bg-pink-50 p-6 rounded-b-xl shadow card hidden">
    <h3 class="text-lg font-bold mb-2 text-pink-700">
        <span class="icon">✨</span>Interesting Facts
    </h3>
    <div class="markdown-content" id="interesting-facts"></div>
</div>
```

##### Shopping Suggestions Card
```html
<div id="shopping-suggestions-card" class="bg-green-50 p-6 rounded-b-xl shadow card hidden">
    <h3 class="text-lg font-bold mb-2 text-green-700">
        <span class="icon">🛍️</span>Gợi ý vật phẩm phong thuỷ
    </h3>
    <div class="markdown-content" id="shopping-suggestions"></div>
</div>
```

#### Card States
- **Hidden**: `display: none` or `.hidden` class
- **Visible**: `.show` class applied
- **Loading**: Content being streamed
- **Complete**: Final content displayed

#### Card Animations
```css
.card {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s, transform 0.5s;
}

.card.show {
    opacity: 1;
    transform: translateY(0);
}

.card:hover {
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
    transform: translateY(-2px) scale(1.01);
}
```

## Interactive Button Components

### Modern Button Base Class

#### CSS Definition
```css
.modern-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-radius: 2rem;
    font-weight: 600;
    box-shadow: 0 2px 8px 0 rgba(59,130,246,0.08);
    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
}

.modern-btn:hover {
    background: #3b82f6;
    color: #fff;
    box-shadow: 0 4px 16px 0 rgba(59,130,246,0.15);
}
```

### Section Navigation Buttons

#### Personality Button
```html
<button id="btn-personality" class="modern-btn bg-teal-100 text-teal-700 font-semibold py-2 px-4" onclick="manualOpenCard('personality-traits-card')">
    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
    Xem Personality Traits
</button>
```

#### Life Cycle Button
```html
<button id="btn-life-cycle" class="modern-btn bg-yellow-100 text-yellow-700 font-semibold py-2 px-4" onclick="manualOpenCard('life-cycle-card')">
    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0-6C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
    </svg>
    Xem Life Cycle Analysis
</button>
```

#### Shopping Button (Highlighted)
```html
<button id="btn-shopping" class="modern-btn bg-green-100 text-green-700 font-semibold py-2 px-4 pulse-highlight" onclick="manualOpenShoppingCard()">
    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M6 6h15l-1.5 9h-13z"/>
        <circle cx="9" cy="21" r="1"/>
        <circle cx="19" cy="21" r="1"/>
    </svg>
    Gợi ý vật phẩm phong thuỷ
</button>
```

### Special Effects

#### Pulse Highlight Animation
```css
.pulse-highlight {
    box-shadow: 0 0 0 0 rgba(34,197,94,0.7);
    animation: pulse-green 1.5s infinite;
    border: 2.5px solid #22c55e;
}

@keyframes pulse-green {
    0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.7); }
    70% { box-shadow: 0 0 0 12px rgba(34,197,94,0.0); }
    100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.0); }
}
```

## Progress Components

### Progress Bar Container

#### HTML Structure
```html
<div id="progress-bar-container" class="w-full flex justify-center mb-6 hidden">
    <div class="w-2/3 bg-gray-200 rounded-full h-3 overflow-hidden">
        <div id="progress-bar" class="bg-blue-400 h-3 rounded-full transition-all duration-300" style="width:0%"></div>
    </div>
</div>
```

#### Animation
```css
#progress-bar {
    background: linear-gradient(90deg, #60a5fa 0%, #818cf8 100%);
    animation: progress-stripes 1s linear infinite;
}

@keyframes progress-stripes {
    0% { background-position: 0 0; }
    100% { background-position: 40px 0; }
}
```

#### JavaScript Control
```javascript
// Show progress bar
document.getElementById('progress-bar-container').classList.remove('hidden');

// Update progress
document.getElementById('progress-bar').style.width = '50%';

// Hide progress bar
document.getElementById('progress-bar-container').classList.add('hidden');
```

## Layout Components

### Main Container

#### Structure
```html
<div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Application content -->
</div>
```

#### Responsive Styles
```css
.max-w-4xl {
    background: rgba(255,255,255,0.7);
    border-radius: 2rem;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
}

@media (max-width: 640px) {
    .max-w-4xl { 
        padding: 0.5rem; 
    }
    .grid-cols-1, .md\:grid-cols-2 { 
        grid-template-columns: 1fr !important; 
    }
}
```

### Grid Layout

#### Analysis Grid
```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <!-- Cards are placed here -->
</div>
```

#### Button Grid
```html
<div id="card-buttons" class="flex flex-col md:flex-row gap-4 justify-center mb-6 hidden">
    <!-- Navigation buttons -->
</div>
```

## Event Handling Patterns

### Card Management
```javascript
function manualOpenCard(cardId) {
    const card = document.getElementById(cardId);
    if (card) {
        card.classList.remove('hidden');
        card.classList.add('show');
    }
}

function hideAllCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.add('hidden');
        card.classList.remove('show');
    });
}
```

### Language Switching
```javascript
function updateUILanguage(lang) {
    const langTexts = {
        vi: {
            submit: 'Xử lý',
            processing: 'Đang xử lý...',
            tryAnother: 'Thử ngày khác'
        },
        en: {
            submit: 'Process',
            processing: 'Processing...',
            tryAnother: 'Try Another Date'
        }
    };
    
    Object.keys(langTexts[lang]).forEach(key => {
        const element = document.getElementById(key);
        if (element) element.textContent = langTexts[lang][key];
    });
}
```

### State Management
```javascript
const appState = {
    isProcessing: false,
    currentLanguage: 'vi',
    analysisData: null,
    visibleCards: []
};

function updateState(newState) {
    Object.assign(appState, newState);
    renderUI();
}
```

## Accessibility Features

### ARIA Labels
```html
<button aria-label="Analyze date of birth" id="submit">
    Get My Insights
</button>

<div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
    <div id="progress-bar"></div>
</div>
```

### Keyboard Navigation
```javascript
// Tab order management
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        manageFocusOrder(e);
    }
});

// Enter key submission
document.getElementById('dob').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        processDOB();
    }
});
```

### Screen Reader Support
```html
<div aria-live="polite" id="status-announcements"></div>
<div aria-live="assertive" id="error-announcements"></div>
```

## Performance Optimization

### Lazy Loading
```javascript
// Defer non-critical animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
});

document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
});
```

### Debounced Updates
```javascript
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedValidation = debounce(validateDate, 300);
```

This component reference provides detailed information about every UI component, their states, properties, and interaction patterns in the DOB Application frontend.