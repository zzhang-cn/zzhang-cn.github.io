/**
 * LLM4LLM Shared Utilities
 * Common functions used across multiple visualizations
 */

// Number formatting utilities
function formatNumber(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(0) + 'k';
    return num.toString();
}

function formatNumberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatPercentage(decimal, precision = 1) {
    return (decimal * 100).toFixed(precision) + '%';
}

// Math utilities
function calculateDistance(point1, point2) {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function cosineSimilarity(vec1, vec2) {
    const dot = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const norm1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const norm2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
    return dot / (norm1 * norm2);
}

function softmax(logits) {
    const maxLogit = Math.max(...logits);
    const exps = logits.map(x => Math.exp(x - maxLogit)); // Subtract max for numerical stability
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(x => x / sum);
}

// Canvas utilities
function initHighDPICanvas(canvas) {
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    return ctx;
}

function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

// Text processing utilities
function tokenize(text, options = {}) {
    const {
        lowercase = true,
        removePunctuation = false,
        splitPunctuation = true
    } = options;
    
    let processed = text;
    
    if (lowercase) {
        processed = processed.toLowerCase();
    }
    
    if (splitPunctuation) {
        // Split punctuation but keep it as separate tokens
        processed = processed.replace(/([.,!?;:"()[\]{}])/g, ' $1 ');
    } else if (removePunctuation) {
        // Remove punctuation entirely
        processed = processed.replace(/[.,!?;:"()[\]{}]/g, '');
    }
    
    return processed.split(/\s+/).filter(token => token.length > 0);
}

function generateNgrams(tokens, n) {
    const ngrams = {};
    
    for (let i = 0; i <= tokens.length - n; i++) {
        const ngram = tokens.slice(i, i + n).join(' ');
        ngrams[ngram] = (ngrams[ngram] || 0) + 1;
    }
    
    return ngrams;
}

function calculatePerplexity(probabilities) {
    const logProbs = probabilities.map(p => Math.log2(Math.max(p, 1e-10))); // Avoid log(0)
    const avgLogProb = logProbs.reduce((a, b) => a + b, 0) / logProbs.length;
    return Math.pow(2, -avgLogProb);
}

// Chart utilities
function createDefaultChartOptions(options = {}) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: options.showLegend !== false
            },
            tooltip: {
                enabled: options.showTooltips !== false
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: options.xAxisLabel || 'X Axis'
                }
            },
            y: {
                title: {
                    display: true,
                    text: options.yAxisLabel || 'Y Axis'
                }
            }
        },
        ...options.chartSpecific
    };
}

function destroyChart(chart) {
    if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
    }
}

// Color utilities
function getColorPalette() {
    return [
        '#667eea', '#764ba2', '#28a745', '#dc3545', 
        '#ffc107', '#17a2b8', '#6f42c1', '#fd7e14',
        '#20c997', '#e83e8c', '#6c757d', '#343a40'
    ];
}

function interpolateColor(color1, color2, factor) {
    // Simple RGB interpolation
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    
    if (!c1 || !c2) return color1;
    
    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);
    
    return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Animation utilities
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function animate(duration, callback, onComplete) {
    const startTime = performance.now();
    
    function frame() {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(progress);
        
        callback(eased, progress);
        
        if (progress < 1) {
            requestAnimationFrame(frame);
        } else if (onComplete) {
            onComplete();
        }
    }
    
    requestAnimationFrame(frame);
}

// DOM utilities
function createElement(tag, className, textContent) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function toggleClass(element, className, condition) {
    if (condition === undefined) {
        element.classList.toggle(className);
    } else {
        element.classList.toggle(className, condition);
    }
}

// Event utilities
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Data utilities
function sortObjectByValue(obj, descending = true) {
    return Object.entries(obj)
        .sort(([,a], [,b]) => descending ? b - a : a - b);
}

function getTopN(obj, n = 10) {
    return sortObjectByValue(obj, true).slice(0, n);
}

function normalizeArray(arr) {
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const range = max - min;
    
    if (range === 0) return arr.map(() => 0);
    
    return arr.map(x => (x - min) / range);
}

// Random utilities
function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Validation utilities
function isValidNumber(value) {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// Storage utilities (for demo data and presets)
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.warn('Failed to save to localStorage:', e);
        return false;
    }
}

function loadFromLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.warn('Failed to load from localStorage:', e);
        return defaultValue;
    }
}

// URL utilities
function updateURLParams(params) {
    const url = new URL(window.location);
    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            url.searchParams.set(key, value);
        } else {
            url.searchParams.delete(key);
        }
    });
    window.history.replaceState({}, '', url);
}

function getURLParams() {
    const params = {};
    const urlParams = new URLSearchParams(window.location.search);
    for (const [key, value] = urlParams.entries()) {
        params[key] = value;
    }
    return params;
}

// Feature detection
function supportsLocalStorage() {
    try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

function supportsCanvas() {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext && canvas.getContext('2d'));
}

// Preset data commonly used across visualizations
const COMMON_PRESETS = {
    simple: "The cat sat on the mat. The dog chased the cat around the yard. The cat ran up the tree and the dog barked below.",
    
    dialogue: '"Hello," said Alice. "Hello," replied Bob. "How are you today?" asked Alice. "I am fine, thank you," said Bob.',
    
    news: "The president announced new economic policies yesterday. The policies focus on job creation and inflation control. Market analysts expect positive responses.",
    
    technical: "Machine learning algorithms process large datasets to identify patterns. Neural networks use backpropagation to optimize parameters through gradient descent.",
    
    literature: "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness."
};

// Common vocabulary for demonstrations
const DEMO_VOCABULARY = [
    // Common words
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    
    // Animals
    'cat', 'dog', 'bird', 'fish', 'mouse', 'elephant', 'lion', 'tiger', 'bear', 'wolf',
    
    // Actions
    'run', 'walk', 'jump', 'sit', 'stand', 'eat', 'sleep', 'play', 'work', 'study',
    
    // Objects
    'house', 'car', 'book', 'table', 'chair', 'phone', 'computer', 'tree', 'flower', 'ball',
    
    // Colors
    'red', 'blue', 'green', 'yellow', 'black', 'white', 'purple', 'orange', 'pink', 'brown',
    
    // Numbers
    'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'
];

// Export for use in modules (if using ES6 modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatNumber,
        formatNumberWithCommas,
        formatPercentage,
        calculateDistance,
        cosineSimilarity,
        softmax,
        initHighDPICanvas,
        roundRect,
        tokenize,
        generateNgrams,
        calculatePerplexity,
        createDefaultChartOptions,
        destroyChart,
        getColorPalette,
        interpolateColor,
        animate,
        createElement,
        clearElement,
        toggleClass,
        debounce,
        throttle,
        sortObjectByValue,
        getTopN,
        normalizeArray,
        randomChoice,
        randomFloat,
        randomInt,
        shuffle,
        isValidNumber,
        clamp,
        saveToLocalStorage,
        loadFromLocalStorage,
        updateURLParams,
        getURLParams,
        supportsLocalStorage,
        supportsCanvas,
        COMMON_PRESETS,
        DEMO_VOCABULARY
    };
}
