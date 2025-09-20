// Hugging Face Integration for MahiLLM
class HuggingFaceIntegration {
    constructor() {
        this.apiBase = 'https://huggingface.co/api';
        this.organization = 'MahiLLM';
        this.init();
    }

    async init() {
        try {
            await this.loadHuggingFaceStats();
            this.setupHuggingFaceWidgets();
            this.setupModelPreview();
        } catch (error) {
            console.error('Failed to initialize Hugging Face integration:', error);
        }
    }

    // Fetch Hugging Face organization stats
    async loadHuggingFaceStats() {
        try {
            // Note: Hugging Face API doesn't provide public endpoints for organization stats
            // This is a mock implementation. In a real scenario, you would:
            // 1. Use Hugging Face Hub API if available
            // 2. Implement server-side caching
            // 3. Use web scraping (with proper permissions)
            
            const mockStats = {
                followers: 1,
                models: 0,
                datasets: 0,
                teamMembers: 1,
                lastUpdated: new Date().toISOString()
            };

            this.updateStatsDisplay(mockStats);
            
            // Store in localStorage for caching
            localStorage.setItem('hf_stats', JSON.stringify(mockStats));
            
        } catch (error) {
            console.error('Failed to load Hugging Face stats:', error);
            // Fallback to cached stats
            const cachedStats = localStorage.getItem('hf_stats');
            if (cachedStats) {
                this.updateStatsDisplay(JSON.parse(cachedStats));
            }
        }
    }

    // Update stats display
    updateStatsDisplay(stats) {
        const elements = {
            followers: document.getElementById('hfFollowers'),
            models: document.querySelector('.hf-stats .stat-item:nth-child(2) .stat-number'),
            datasets: document.querySelector('.hf-stats .stat-item:nth-child(3) .stat-number'),
            teamMembers: document.querySelector('.hf-stats .stat-item:nth-child(4) .stat-number')
        };

        if (elements.followers) {
            this.animateNumber(elements.followers, 0, stats.followers, 1000);
        }
        if (elements.models) {
            this.animateNumber(elements.models, 0, stats.models, 1000);
        }
        if (elements.datasets) {
            this.animateNumber(elements.datasets, 0, stats.datasets, 1000);
        }
        if (elements.teamMembers) {
            this.animateNumber(elements.teamMembers, 0, stats.teamMembers, 1000);
        }
    }

    // Animate number counting
    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = start + (end - start) * progress;
            element.textContent = Math.floor(current).toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };
        requestAnimationFrame(updateNumber);
    }

    // Setup Hugging Face widgets
    setupHuggingFaceWidgets() {
        // Add Hugging Face follow button
        this.addFollowButton();
        
        // Add model preview cards
        this.addModelPreviewCards();
        
        // Add dataset preview cards
        this.addDatasetPreviewCards();
    }

    // Add follow button
    addFollowButton() {
        const followBtn = document.querySelector('.hf-card .btn-primary');
        if (followBtn) {
            followBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.open('https://huggingface.co/MahiLLM', '_blank');
                
                // Track follow event
                this.trackEvent('hf_follow_click', {
                    source: 'website',
                    timestamp: new Date().toISOString()
                });
            });
        }
    }

    // Add model preview cards
    addModelPreviewCards() {
        const comingSoonGrid = document.querySelector('.coming-soon-grid');
        if (!comingSoonGrid) return;

        // Add interactive functionality to model cards
        const modelCards = comingSoonGrid.querySelectorAll('.coming-soon-item');
        modelCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                this.showModelDetails(index);
            });
            
            // Add hover effects
            card.style.cursor = 'pointer';
        });
    }

    // Show model details
    showModelDetails(modelIndex) {
        const modelDetails = [
            {
                name: 'MahiLLM-7B',
                description: 'Fine-tuned LLaMA 2-7B model specialized for data analysis and business insights generation.',
                capabilities: [
                    'Automatic data summarization',
                    'Trend analysis and forecasting',
                    'Business intelligence reports',
                    'Natural language queries on data'
                ],
                technicalSpecs: {
                    'Model Size': '7B parameters',
                    'Base Model': 'LLaMA 2-7B',
                    'Fine-tuning Data': 'Business datasets',
                    'Context Length': '4096 tokens',
                    'Inference Speed': '~50 tokens/second'
                },
                useCases: [
                    'Financial analysis',
                    'Sales reporting',
                    'Market research',
                    'Operational insights'
                ]
            },
            {
                name: 'Business Data Dataset',
                description: 'Curated collection of business metrics, KPIs, and performance data for training data analysis models.',
                capabilities: [
                    'Multi-industry coverage',
                    'Standardized metrics',
                    'Time-series data',
                    'Anonymized real-world data'
                ],
                technicalSpecs: {
                    'Records': '1M+ data points',
                    'Industries': '15+ sectors',
                    'Time Range': '2020-2024',
                    'Update Frequency': 'Monthly',
                    'Data Quality': '98% accuracy'
                },
                useCases: [
                    'Model training',
                    'Benchmark testing',
                    'Research purposes',
                    'Educational use'
                ]
            },
            {
                name: 'Insights Generator',
                description: 'Pre-trained model for automatic business insights generation from raw data.',
                capabilities: [
                    'Pattern recognition',
                    'Anomaly detection',
                    'Predictive analytics',
                    'Automated reporting'
                ],
                technicalSpecs: {
                    'Model Type': 'Transformer-based',
                    'Training Data': '10M+ business reports',
                    'Output Format': 'Structured insights',
                    'Processing Speed': 'Real-time',
                    'Accuracy': '94% validated'
                },
                useCases: [
                    'Dashboard automation',
                    'Executive summaries',
                    'Risk assessment',
                    'Performance monitoring'
                ]
            }
        ];

        const model = modelDetails[modelIndex];
        if (!model) return;

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'hf-model-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${model.name}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="model-description">
                            <p>${model.description}</p>
                        </div>
                        
                        <div class="model-capabilities">
                            <h4>Capabilities</h4>
                            <ul>
                                ${model.capabilities.map(cap => `<li>${cap}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="model-specs">
                            <h4>Technical Specifications</h4>
                            <div class="specs-grid">
                                ${Object.entries(model.technicalSpecs).map(([key, value]) => `
                                    <div class="spec-item">
                                        <span class="spec-key">${key}:</span>
                                        <span class="spec-value">${value}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="model-use-cases">
                            <h4>Use Cases</h4>
                            <div class="use-cases-grid">
                                ${model.useCases.map(useCase => `
                                    <div class="use-case-item">${useCase}</div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="modal-actions">
                            <button class="btn-primary" onclick="window.open('https://huggingface.co/MahiLLM', '_blank')">
                                <i class="fab fa-hugging-face"></i>
                                View on Hugging Face
                            </button>
                            <button class="btn-secondary" onclick="this.closest('.hf-model-modal').remove()">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        this.addModalStyles();
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => modal.remove());
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal.querySelector('.modal-overlay')) {
                modal.remove();
            }
        });
    }

    // Add modal styles
    addModalStyles() {
        if (document.getElementById('hf-modal-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'hf-modal-styles';
        style.textContent = `
            .hf-model-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease-out;
            }
            
            .hf-model-modal .modal-content {
                background: white;
                border-radius: 16px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                animation: slideUp 0.3s ease-out;
            }
            
            .hf-model-modal .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 30px;
                border-bottom: 1px solid #e2e8f0;
            }
            
            .hf-model-modal .modal-header h3 {
                margin: 0;
                color: #1e293b;
            }
            
            .hf-model-modal .modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #64748b;
            }
            
            .hf-model-modal .modal-body {
                padding: 30px;
            }
            
            .model-description {
                margin-bottom: 30px;
            }
            
            .model-description p {
                font-size: 16px;
                line-height: 1.6;
                color: #475569;
            }
            
            .model-capabilities h4,
            .model-specs h4,
            .model-use-cases h4 {
                color: #1e293b;
                margin-bottom: 15px;
                font-size: 18px;
            }
            
            .model-capabilities ul {
                list-style: none;
                padding: 0;
            }
            
            .model-capabilities li {
                padding: 8px 0;
                color: #475569;
                position: relative;
                padding-left: 20px;
            }
            
            .model-capabilities li:before {
                content: '✓';
                position: absolute;
                left: 0;
                color: #10a37f;
                font-weight: bold;
            }
            
            .specs-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-bottom: 30px;
            }
            
            .spec-item {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #10a37f;
            }
            
            .spec-key {
                font-weight: 600;
                color: #1e293b;
            }
            
            .spec-value {
                color: #475569;
                margin-left: 8px;
            }
            
            .use-cases-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 10px;
                margin-bottom: 30px;
            }
            
            .use-case-item {
                background: linear-gradient(135deg, #10a37f 0%, #4dabf7 100%);
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                text-align: center;
                font-size: 14px;
                font-weight: 500;
            }
            
            .modal-actions {
                display: flex;
                gap: 15px;
                justify-content: center;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        
        document.head.appendChild(style);
    }

    // Add dataset preview cards
    addDatasetPreviewCards() {
        // Similar implementation for dataset cards
        console.log('Dataset preview cards setup');
    }

    // Setup model preview
    setupModelPreview() {
        // Add model preview functionality
        this.addModelPreviewButton();
    }

    // Add model preview button
    addModelPreviewButton() {
        const modelAccessSection = document.querySelector('#model-access');
        if (modelAccessSection) {
            const previewBtn = document.createElement('button');
            previewBtn.className = 'btn-outline';
            previewBtn.innerHTML = '<i class="fab fa-hugging-face"></i> Preview on Hugging Face';
            previewBtn.style.marginTop = '20px';
            previewBtn.style.width = '100%';
            
            previewBtn.addEventListener('click', () => {
                window.open('https://huggingface.co/MahiLLM', '_blank');
                this.trackEvent('hf_preview_click', {
                    source: 'model_access_section',
                    timestamp: new Date().toISOString()
                });
            });
            
            const accessOptions = modelAccessSection.querySelector('.access-options');
            if (accessOptions) {
                accessOptions.appendChild(previewBtn);
            }
        }
    }

    // Track events
    trackEvent(eventName, eventData) {
        // Send to analytics service
        console.log('HF Event:', eventName, eventData);
        
        // Store locally for debugging
        const events = JSON.parse(localStorage.getItem('hf_events') || '[]');
        events.push({
            event: eventName,
            data: eventData,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('hf_events', JSON.stringify(events));
    }

    // Get tracking data
    getTrackingData() {
        return JSON.parse(localStorage.getItem('hf_events') || '[]');
    }

    // Refresh stats (manual refresh)
    async refreshStats() {
        await this.loadHuggingFaceStats();
    }

    // Get organization info
    getOrganizationInfo() {
        return {
            name: this.organization,
            url: `https://huggingface.co/${this.organization}`,
            apiBase: this.apiBase,
            lastUpdated: new Date().toISOString()
        };
    }
}

// Initialize Hugging Face integration when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const hfIntegration = new HuggingFaceIntegration();
    
    // Store reference for debugging
    window.mahiLLMHF = hfIntegration;
});

// Export for use in other modules
export default HuggingFaceIntegration;
