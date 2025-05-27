/**
 * LLM4LLM Header Template Generator
 * Creates consistent headers for all visualization pages
 */

function createHeader(config) {
    const {
        title,
        description,
        module = 'Module 1',
        session = 'Session 1.1',
        moduleUrl = '../',
        allModulesUrl = '../../'
    } = config;
    
    return `
    <div class="header">
        <div class="header-content">
            <div class="breadcrumb">
                <a href="${allModulesUrl}">← All Modules</a> / 
                <a href="${moduleUrl}">${module}</a> / 
                ${session}
            </div>
            <h1>${title}</h1>
            <p>${description}</p>
        </div>
    </div>`;
}

// Usage examples for different sessions:
const headerConfigs = {
    // Session 1.1
    'word-frequency': {
        title: 'Word Frequency Explorer',
        description: 'Discover how word frequencies in natural language follow predictable power law patterns',
        session: 'Session 1.1'
    },
    
    'qa-patterns': {
        title: 'Instruction Following Patterns',
        description: 'Discover how next-word prediction enables AI to follow human instructions',
        session: 'Session 1.1'
    },
    
    // Session 1.2
    'ngram-builder': {
        title: 'N-gram Builder',
        description: 'Build n-grams from text and see how prediction quality changes with context size',
        session: 'Session 1.2'
    },
    
    'sparsity-explorer': {
        title: 'Sparsity Explorer',
        description: 'Visualize how n-gram coverage drops exponentially as sequence length increases',
        session: 'Session 1.2'
    },
    
    // Session 1.3
    'embedding-space': {
        title: 'Word Embedding Space',
        description: 'Explore semantic relationships through vector distances in a conceptual 2D embedding space',
        session: 'Session 1.3'
    },
    
    'softmax-calc': {
        title: 'Softmax Calculator',
        description: 'Interactive softmax demonstration showing how raw scores become probability distributions',
        session: 'Session 1.3'
    },
    
    'bengio-model': {
        title: 'Bengio Neural Language Model',
        description: 'Explore the complete neural network architecture from input words to probability distributions',
        session: 'Session 1.3'
    },
    
    // Session 1.4
    'loss-explorer': {
        title: 'Loss Function Explorer',
        description: 'See how cross-entropy loss varies with prediction confidence and understand training dynamics',
        session: 'Session 1.4'
    },
    
    'gradient-sim': {
        title: 'Gradient Descent Simulator',
        description: 'Watch gradient descent navigate loss landscapes with different learning rates',
        session: 'Session 1.4'
    },
    
    'training-progress': {
        title: 'Training Progress Visualizer',
        description: 'Monitor neural language model training with real-time loss and accuracy metrics',
        session: 'Session 1.4'
    },
    
    'perplexity-calc': {
        title: 'Perplexity Calculator',
        description: 'Calculate and compare perplexity scores across different language models',
        session: 'Session 1.4'
    },
    
    // Session 1.5
    'word2vec-demo': {
        title: 'Word2Vec Architecture',
        description: 'Compare Skip-gram and CBOW architectures with interactive demonstrations',
        session: 'Session 1.5'
    },
    
    'context-training': {
        title: 'Context-Based Training',
        description: 'Explore how Word2Vec learns from context windows and negative sampling',
        session: 'Session 1.5'
    },
    
    'analogy-solver': {
        title: 'Vector Analogy Solver',
        description: 'Solve word analogies with vector arithmetic: king - man + woman = ?',
        session: 'Session 1.5'
    },
    
    'embedding-apps': {
        title: 'Embedding Applications',
        description: 'See how word embeddings power real-world NLP applications',
        session: 'Session 1.5'
    },
    
    'polysemy-demo': {
        title: 'Polysemy Problem Demo',
        description: 'See how static embeddings struggle with words that have multiple meanings',
        session: 'Session 1.5'
    }
};

// Initialize header for current page
function initializeHeader(pageId) {
    const config = headerConfigs[pageId];
    if (!config) {
        console.warn(`No header config found for page: ${pageId}`);
        return;
    }
    
    const headerHTML = createHeader(config);
    const headerContainer = document.getElementById('header-container') || document.body;
    
    if (document.getElementById('header-container')) {
        headerContainer.innerHTML = headerHTML;
    } else {
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
    }
}

// Auto-detect page ID from filename if not specified
function autoInitializeHeader() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().split('.')[0];
    
    // Try to find matching config
    const pageId = Object.keys(headerConfigs).find(id => filename.includes(id));
    
    if (pageId) {
        initializeHeader(pageId);
    }
}

// Export functions
if (typeof window !== 'undefined') {
    window.LLM4LLMHeader = {
        createHeader,
        initializeHeader,
        autoInitializeHeader,
        headerConfigs
    };
}
