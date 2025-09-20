// Advanced OpenAI-Inspired Features for MahiLLM
import { backendAPI } from './backend-api.js';

class AdvancedFeatures {
    constructor() {
        this.isInitialized = false;
        this.animationFrameId = null;
        this.mousePosition = { x: 0, y: 0 };
        this.particles = [];
        this.maxParticles = 50;
        this.init();
    }

    async init() {
        try {
            this.setupInteractiveBackground();
            this.setupScrollAnimations();
            this.setupMouseFollowingEffects();
            this.setupAnimatedBlobs();
            this.setupFloatingNavbar();
            this.setupContentRevealAnimations();
            this.setupAIChatbot();
            this.setupOnSiteGeneration();
            this.setupPersonalization();
            
            this.isInitialized = true;
            console.log('Advanced features initialized successfully');
        } catch (error) {
            console.error('Failed to initialize advanced features:', error);
        }
    }

    // Interactive Background with Mouse-Following Effects
    setupInteractiveBackground() {
        const background = document.createElement('div');
        background.className = 'interactive-background';
        background.innerHTML = `
            <div class="gradient-orb gradient-orb-1"></div>
            <div class="gradient-orb gradient-orb-2"></div>
            <div class="gradient-orb gradient-orb-3"></div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .interactive-background {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: -1;
                overflow: hidden;
            }
            
            .gradient-orb {
                position: absolute;
                border-radius: 50%;
                filter: blur(40px);
                opacity: 0.3;
                animation: float 20s infinite ease-in-out;
            }
            
            .gradient-orb-1 {
                width: 300px;
                height: 300px;
                background: radial-gradient(circle, #10a37f 0%, transparent 70%);
                top: 20%;
                left: 10%;
                animation-delay: 0s;
            }
            
            .gradient-orb-2 {
                width: 400px;
                height: 400px;
                background: radial-gradient(circle, #4dabf7 0%, transparent 70%);
                top: 60%;
                right: 20%;
                animation-delay: -7s;
            }
            
            .gradient-orb-3 {
                width: 250px;
                height: 250px;
                background: radial-gradient(circle, #ff6b6b 0%, transparent 70%);
                bottom: 20%;
                left: 50%;
                animation-delay: -14s;
            }
            
            @keyframes float {
                0%, 100% { transform: translate(0, 0) scale(1); }
                25% { transform: translate(30px, -30px) scale(1.1); }
                50% { transform: translate(-20px, 20px) scale(0.9); }
                75% { transform: translate(20px, 10px) scale(1.05); }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(background);
        
        // Mouse following effect
        document.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
            
            const orbs = document.querySelectorAll('.gradient-orb');
            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 0.02;
                const x = (e.clientX - window.innerWidth / 2) * speed;
                const y = (e.clientY - window.innerHeight / 2) * speed;
                
                orb.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    // Scroll-Triggered Animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.feature-card, .pricing-card, .stat-card, .access-card, .contact-method');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Mouse Following Particle System
    setupMouseFollowingEffects() {
        const canvas = document.createElement('canvas');
        canvas.className = 'particle-canvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Create particles
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            this.particles.forEach(particle => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Mouse attraction
                const dx = this.mousePosition.x - particle.x;
                const dy = this.mousePosition.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    particle.vx += dx * force * 0.001;
                    particle.vy += dy * force * 0.001;
                }
                
                // Boundary check
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(16, 163, 127, ${particle.opacity})`;
                ctx.fill();
            });
            
            this.animationFrameId = requestAnimationFrame(animate);
        };
        
        animate();

        // Resize handler
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // Animated Blob Shapes
    setupAnimatedBlobs() {
        const blobContainer = document.createElement('div');
        blobContainer.className = 'blob-container';
        blobContainer.innerHTML = `
            <div class="blob blob-1"></div>
            <div class="blob blob-2"></div>
            <div class="blob blob-3"></div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .blob-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: -1;
                overflow: hidden;
            }
            
            .blob {
                position: absolute;
                border-radius: 50%;
                filter: blur(60px);
                opacity: 0.1;
                animation: morph 15s infinite ease-in-out;
            }
            
            .blob-1 {
                width: 500px;
                height: 500px;
                background: linear-gradient(45deg, #10a37f, #4dabf7);
                top: -250px;
                left: -250px;
                animation-delay: 0s;
            }
            
            .blob-2 {
                width: 400px;
                height: 400px;
                background: linear-gradient(45deg, #ff6b6b, #10a37f);
                bottom: -200px;
                right: -200px;
                animation-delay: -5s;
            }
            
            .blob-3 {
                width: 300px;
                height: 300px;
                background: linear-gradient(45deg, #4dabf7, #ff6b6b);
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                animation-delay: -10s;
            }
            
            @keyframes morph {
                0%, 100% { 
                    transform: scale(1) rotate(0deg);
                    border-radius: 50%;
                }
                25% { 
                    transform: scale(1.2) rotate(90deg);
                    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
                }
                50% { 
                    transform: scale(0.8) rotate(180deg);
                    border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%;
                }
                75% { 
                    transform: scale(1.1) rotate(270deg);
                    border-radius: 50% 50% 50% 50% / 30% 70% 30% 70%;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(blobContainer);
    }

    // Floating Navbar
    setupFloatingNavbar() {
        const navbar = document.querySelector('.header');
        if (!navbar) return;

        let lastScrollY = window.scrollY;
        let isHidden = false;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(20px)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                
                // Hide/show navbar based on scroll direction
                if (currentScrollY > lastScrollY && currentScrollY > 200) {
                    if (!isHidden) {
                        navbar.style.transform = 'translateY(-100%)';
                        isHidden = true;
                    }
                } else {
                    if (isHidden) {
                        navbar.style.transform = 'translateY(0)';
                        isHidden = false;
                    }
                }
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.8)';
                navbar.style.backdropFilter = 'blur(10px)';
                navbar.style.boxShadow = 'none';
                navbar.style.transform = 'translateY(0)';
                isHidden = false;
            }
            
            lastScrollY = currentScrollY;
        });
    }

    // Content Reveal Animations
    setupContentRevealAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(50px)';
            section.style.transition = 'all 0.8s ease-out';
            observer.observe(section);
        });
    }

    // AI Chatbot Integration
    setupAIChatbot() {
        // Create chatbot button
        const chatbotButton = document.createElement('div');
        chatbotButton.className = 'chatbot-button';
        chatbotButton.innerHTML = `
            <div class="chatbot-icon">
                <i class="fas fa-robot"></i>
            </div>
            <div class="chatbot-pulse"></div>
        `;
        
        const chatbotStyle = document.createElement('style');
        chatbotStyle.textContent = `
            .chatbot-button {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #10a37f 0%, #4dabf7 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(16, 163, 127, 0.3);
                z-index: 1000;
                transition: all 0.3s ease;
            }
            
            .chatbot-button:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 25px rgba(16, 163, 127, 0.4);
            }
            
            .chatbot-icon {
                color: white;
                font-size: 24px;
            }
            
            .chatbot-pulse {
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: rgba(16, 163, 127, 0.3);
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                100% { transform: scale(1.5); opacity: 0; }
            }
        `;
        
        document.head.appendChild(chatbotStyle);
        document.body.appendChild(chatbotButton);
        
        // Chatbot functionality
        chatbotButton.addEventListener('click', () => {
            this.openAIChatbot();
        });
    }

    // Open AI Chatbot
    openAIChatbot() {
        const chatbot = document.createElement('div');
        chatbot.className = 'ai-chatbot';
        chatbot.innerHTML = `
            <div class="chatbot-header">
                <h3>MahiLLM Assistant</h3>
                <button class="chatbot-close">&times;</button>
            </div>
            <div class="chatbot-messages">
                <div class="message bot-message">
                    <div class="message-content">
                        Hello! I'm your MahiLLM assistant. How can I help you today?
                    </div>
                </div>
            </div>
            <div class="chatbot-input">
                <input type="text" placeholder="Ask me anything about MahiLLM..." />
                <button class="send-button">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        `;
        
        const chatbotModalStyle = document.createElement('style');
        chatbotModalStyle.textContent = `
            .ai-chatbot {
                position: fixed;
                bottom: 100px;
                right: 30px;
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                z-index: 1001;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                animation: slideUp 0.3s ease-out;
            }
            
            .chatbot-header {
                background: linear-gradient(135deg, #10a37f 0%, #4dabf7 100%);
                color: white;
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .chatbot-close {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
            }
            
            .chatbot-messages {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .message {
                max-width: 80%;
                padding: 10px 15px;
                border-radius: 15px;
                word-wrap: break-word;
            }
            
            .bot-message {
                background: #f1f5f9;
                align-self: flex-start;
            }
            
            .user-message {
                background: linear-gradient(135deg, #10a37f 0%, #4dabf7 100%);
                color: white;
                align-self: flex-end;
            }
            
            .chatbot-input {
                padding: 20px;
                display: flex;
                gap: 10px;
                border-top: 1px solid #e2e8f0;
            }
            
            .chatbot-input input {
                flex: 1;
                padding: 10px 15px;
                border: 1px solid #e2e8f0;
                border-radius: 25px;
                outline: none;
            }
            
            .send-button {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #10a37f 0%, #4dabf7 100%);
                border: none;
                border-radius: 50%;
                color: white;
                cursor: pointer;
            }
            
            @keyframes slideUp {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        
        document.head.appendChild(chatbotModalStyle);
        document.body.appendChild(chatbot);
        
        // Chatbot functionality
        const input = chatbot.querySelector('input');
        const sendButton = chatbot.querySelector('.send-button');
        const messages = chatbot.querySelector('.chatbot-messages');
        const closeButton = chatbot.querySelector('.chatbot-close');
        
        const sendMessage = () => {
            const message = input.value.trim();
            if (!message) return;
            
            // Add user message
            const userMessage = document.createElement('div');
            userMessage.className = 'message user-message';
            userMessage.innerHTML = `<div class="message-content">${message}</div>`;
            messages.appendChild(userMessage);
            
            input.value = '';
            messages.scrollTop = messages.scrollHeight;
            
            // Simulate bot response
            setTimeout(() => {
                const botResponse = this.generateBotResponse(message);
                const botMessage = document.createElement('div');
                botMessage.className = 'message bot-message';
                botMessage.innerHTML = `<div class="message-content">${botResponse}</div>`;
                messages.appendChild(botMessage);
                messages.scrollTop = messages.scrollHeight;
            }, 1000);
        };
        
        sendButton.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
        
        closeButton.addEventListener('click', () => {
            chatbot.remove();
        });
    }

    // Generate Bot Response
    generateBotResponse(message) {
        const responses = {
            'hello': 'Hello! Welcome to MahiLLM. How can I help you today?',
            'features': 'MahiLLM offers automatic data analysis, report generation, chart creation, and AI-powered insights. Would you like to know more about any specific feature?',
            'pricing': 'We offer three plans: Free (5 reports/month), Plus (₹250/month), and Enterprise (custom pricing). Check our pricing section for details!',
            'demo': 'You can try our demo by clicking "Try MahiLLM" on our homepage. Upload your data and see instant insights!',
            'contact': 'You can reach us at btech10130.23@bitmesra.ac.in or call +91 9508743874. We\'re located at BIT Mesra, Ranchi.',
            'default': 'That\'s an interesting question! I\'m here to help you learn more about MahiLLM. Try asking about our features, pricing, or how to get started.'
        };
        
        const lowerMessage = message.toLowerCase();
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }
        
        return responses.default;
    }

    // On-Site AI Generation
    setupOnSiteGeneration() {
        // Add AI generation section to homepage
        const generationSection = document.createElement('section');
        generationSection.className = 'ai-generation-section';
        generationSection.innerHTML = `
            <div class="container">
                <div class="section-header">
                    <h2>Try AI Generation</h2>
                    <p>Experience the power of AI directly on our website</p>
                </div>
                <div class="generation-tabs">
                    <button class="tab-btn active" data-tab="text">Text Generation</button>
                    <button class="tab-btn" data-tab="insights">Data Insights</button>
                    <button class="tab-btn" data-tab="charts">Chart Generation</button>
                </div>
                <div class="generation-content">
                    <div class="tab-content active" id="text-generation">
                        <div class="generation-input">
                            <textarea placeholder="Enter your prompt here... (e.g., 'Write a summary of Q3 sales performance')"></textarea>
                            <button class="generate-btn">Generate</button>
                        </div>
                        <div class="generation-output">
                            <div class="output-placeholder">Your generated content will appear here...</div>
                        </div>
                    </div>
                    <div class="tab-content" id="insights-generation">
                        <div class="sample-data">
                            <h4>Sample Data</h4>
                            <div class="data-preview">Sales data for Q3 2024</div>
                        </div>
                        <div class="insights-output">
                            <div class="output-placeholder">AI-generated insights will appear here...</div>
                        </div>
                    </div>
                    <div class="tab-content" id="charts-generation">
                        <div class="chart-options">
                            <select>
                                <option>Bar Chart</option>
                                <option>Line Chart</option>
                                <option>Pie Chart</option>
                            </select>
                        </div>
                        <div class="chart-output">
                            <div class="chart-placeholder">Generated chart will appear here...</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Insert before footer
        const footer = document.querySelector('footer');
        if (footer) {
            footer.parentNode.insertBefore(generationSection, footer);
        }
        
        // Add styles and functionality
        this.setupGenerationStyles();
        this.setupGenerationFunctionality();
    }

    setupGenerationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .ai-generation-section {
                padding: 80px 0;
                background: var(--color-gray-50);
            }
            
            .generation-tabs {
                display: flex;
                justify-content: center;
                gap: 20px;
                margin-bottom: 40px;
            }
            
            .tab-btn {
                padding: 12px 24px;
                background: white;
                border: 1px solid var(--color-gray-200);
                border-radius: 25px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .tab-btn.active {
                background: var(--color-primary);
                color: white;
                border-color: var(--color-primary);
            }
            
            .generation-content {
                max-width: 800px;
                margin: 0 auto;
            }
            
            .tab-content {
                display: none;
                background: white;
                border-radius: 16px;
                padding: 30px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            }
            
            .tab-content.active {
                display: block;
            }
            
            .generation-input textarea {
                width: 100%;
                height: 120px;
                padding: 15px;
                border: 1px solid var(--color-gray-200);
                border-radius: 8px;
                resize: vertical;
                margin-bottom: 20px;
            }
            
            .generate-btn {
                background: var(--color-primary);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .generate-btn:hover {
                background: var(--color-primary-hover);
                transform: translateY(-2px);
            }
            
            .output-placeholder {
                padding: 40px;
                text-align: center;
                color: var(--color-gray-500);
                background: var(--color-gray-50);
                border-radius: 8px;
                border: 2px dashed var(--color-gray-200);
            }
        `;
        document.head.appendChild(style);
    }

    setupGenerationFunctionality() {
        // Tab switching
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                button.classList.add('active');
                document.getElementById(`${targetTab}-generation`).classList.add('active');
            });
        });
        
        // Generation functionality
        const generateBtn = document.querySelector('.generate-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.generateContent();
            });
        }
    }

    async generateContent() {
        const textarea = document.querySelector('.generation-input textarea');
        const output = document.querySelector('.generation-output .output-placeholder');
        
        if (!textarea || !output) return;
        
        const prompt = textarea.value.trim();
        if (!prompt) return;
        
        // Show loading state
        output.innerHTML = '<div class="loading">Generating content...</div>';
        
        try {
            // Simulate AI generation
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Mock generated content
            const generatedContent = this.generateMockContent(prompt);
            output.innerHTML = `<div class="generated-content">${generatedContent}</div>`;
            
        } catch (error) {
            output.innerHTML = '<div class="error">Generation failed. Please try again.</div>';
        }
    }

    generateMockContent(prompt) {
        const lowerPrompt = prompt.toLowerCase();
        
        if (lowerPrompt.includes('sales') || lowerPrompt.includes('performance')) {
            return `
                <h4>Sales Performance Analysis</h4>
                <p><strong>Key Insights:</strong></p>
                <ul>
                    <li>Revenue increased by 23% compared to previous quarter</li>
                    <li>Top-performing category: Technology (35% growth)</li>
                    <li>Customer acquisition cost decreased by 15%</li>
                    <li>Average deal size increased by 12%</li>
                </ul>
                <p><strong>Recommendations:</strong></p>
                <ul>
                    <li>Focus on technology sector expansion</li>
                    <li>Implement customer retention strategies</li>
                    <li>Optimize pricing for higher-value deals</li>
                </ul>
            `;
        } else if (lowerPrompt.includes('summary') || lowerPrompt.includes('report')) {
            return `
                <h4>Executive Summary</h4>
                <p>This comprehensive analysis reveals significant growth opportunities across multiple business segments. The data indicates strong performance in core areas with potential for strategic expansion.</p>
                <p>Key metrics show positive trends in customer engagement, operational efficiency, and market penetration. Recommended actions include targeted investments in high-growth areas and optimization of existing processes.</p>
            `;
        } else {
            return `
                <h4>Generated Content</h4>
                <p>Based on your prompt "${prompt}", here's the AI-generated content:</p>
                <p>This is a sample response demonstrating MahiLLM's content generation capabilities. In a real implementation, this would be powered by our LLaMA 2-7B model to provide accurate, contextual responses to your specific requests.</p>
                <p>The system can analyze your input, understand context, and generate relevant, professional content tailored to your needs.</p>
            `;
        }
    }

    // Personalization Features
    setupPersonalization() {
        // User memory for personalized experience
        this.userMemory = JSON.parse(localStorage.getItem('mahillm_user_memory') || '{}');
        
        // Personalized greetings
        this.setupPersonalizedGreetings();
        
        // Remember user preferences
        this.setupUserPreferences();
        
        // Personalized recommendations
        this.setupPersonalizedRecommendations();
    }

    setupPersonalizedGreetings() {
        const user = JSON.parse(localStorage.getItem('mahillm_user') || '{}');
        if (user.name) {
            const greetingElements = document.querySelectorAll('.hero-title, .auth-title');
            greetingElements.forEach(element => {
                if (element.textContent.includes('Welcome') || element.textContent.includes('Transform')) {
                    element.innerHTML = element.innerHTML.replace('Welcome', `Welcome back, ${user.name.split(' ')[0]}`);
                }
            });
        }
    }

    setupUserPreferences() {
        // Theme preference
        const savedTheme = localStorage.getItem('mahillm_theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Language preference
        const savedLanguage = localStorage.getItem('mahillm_language') || 'en';
        document.documentElement.setAttribute('lang', savedLanguage);
        
        // Notification preferences
        const notificationsEnabled = localStorage.getItem('mahillm_notifications') !== 'false';
        if (notificationsEnabled) {
            this.requestNotificationPermission();
        }
    }

    setupPersonalizedRecommendations() {
        // Add personalized recommendations based on user activity
        const recommendations = this.generatePersonalizedRecommendations();
        if (recommendations.length > 0) {
            this.displayRecommendations(recommendations);
        }
    }

    generatePersonalizedRecommendations() {
        const user = JSON.parse(localStorage.getItem('mahillm_user') || '{}');
        const userMemory = this.userMemory;
        
        const recommendations = [];
        
        if (user.role === 'admin') {
            recommendations.push({
                title: 'System Analytics',
                description: 'Monitor system performance and user activity',
                action: 'View Analytics',
                link: '#admin-panel'
            });
        }
        
        if (!userMemory.hasTriedDemo) {
            recommendations.push({
                title: 'Try the Demo',
                description: 'Experience MahiLLM with sample data',
                action: 'Start Demo',
                link: '#model-access'
            });
        }
        
        return recommendations;
    }

    displayRecommendations(recommendations) {
        const recommendationsSection = document.createElement('div');
        recommendationsSection.className = 'personalized-recommendations';
        recommendationsSection.innerHTML = `
            <h3>Recommended for You</h3>
            <div class="recommendations-grid">
                ${recommendations.map(rec => `
                    <div class="recommendation-card">
                        <h4>${rec.title}</h4>
                        <p>${rec.description}</p>
                        <a href="${rec.link}" class="recommendation-btn">${rec.action}</a>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Insert recommendations in appropriate location
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.appendChild(recommendationsSection);
        }
    }

    async requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission();
        }
    }

    // Cleanup method
    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        // Remove event listeners and DOM elements
        const elementsToRemove = [
            '.interactive-background',
            '.particle-canvas',
            '.blob-container',
            '.chatbot-button',
            '.ai-chatbot'
        ];
        
        elementsToRemove.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.remove();
            }
        });
    }
}

// Initialize advanced features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const advancedFeatures = new AdvancedFeatures();
    
    // Store reference for cleanup if needed
    window.mahiLLMAdvancedFeatures = advancedFeatures;
});

// Export for use in other modules
export default AdvancedFeatures;
