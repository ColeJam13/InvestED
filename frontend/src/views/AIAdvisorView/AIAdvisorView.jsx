import { useState, useRef, useEffect } from 'react';
import styles from './AIAdvisorView.module.css';

const AIAdvisorView = () => {
    const [selectedAdvisor, setSelectedAdvisor] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showPortfolioPanel, setShowPortfolioPanel] = useState(true);
    const messagesEndRef = useRef(null);

    // Mock portfolio data (would come from context/API in real app)
    const portfolioData = {
        totalValue: '$50,243.89',
        todayChange: '+$1,234.56',
        todayChangePercent: '+2.52%',
        cashAvailable: '$5,000.00',
        riskProfile: 'Moderate',
        holdings: [
            { symbol: 'AAPL', name: 'Apple Inc.', value: '$1,850.00', change: '+2.3%', positive: true },
            { symbol: 'BTC', name: 'Bitcoin', value: '$34,500.00', change: '-1.2%', positive: false },
            { symbol: 'TSLA', name: 'Tesla Inc.', value: '$1,250.00', change: '+5.7%', positive: true },
            { symbol: 'ETH', name: 'Ethereum', value: '$6,125.00', change: '+1.5%', positive: true },
        ],
        topPerformer: { symbol: 'TSLA', change: '+5.7%' },
        topLoser: { symbol: 'BTC', change: '-1.2%' },
    };

    const advisors = [
        {
            id: 'buffett',
            name: 'Warren Buffett',
            title: 'The Oracle of Omaha',
            style: 'Value Investing',
            description: 'Patient, long-term value investing. Focus on fundamentals and buying great companies at fair prices.',
            avatar: '🎩',
            color: '#1E3A5F',
            greeting: "Hello there! Let's talk about finding wonderful companies at sensible prices. Remember, the stock market is designed to transfer money from the impatient to the patient.",
            quickPrompts: [
                "What makes a company worth investing in?",
                "How do I think long-term?",
                "Explain value investing",
                "What's your view on diversification?"
            ]
        },
        {
            id: 'montaperto',
            name: 'Deborah Montaperto',
            title: 'The Strategic Planner',
            style: 'Goal-Based Planning',
            description: 'Strategic financial planning focused on life goals, risk assessment, and building sustainable wealth.',
            avatar: '📊',
            color: '#7C3AED',
            greeting: "Welcome! I'm here to help you align your investments with your life goals. Let's create a strategy that works for your unique situation and timeline.",
            quickPrompts: [
                "How do I set investment goals?",
                "What's my risk tolerance?",
                "Help me plan for retirement",
                "How should I balance my portfolio?"
            ]
        },
        {
            id: 'ramsey',
            name: 'Dave Ramsey',
            title: 'The Debt-Free Advocate',
            style: 'Conservative & Debt-Free',
            description: 'Conservative approach emphasizing debt elimination, emergency funds, and steady wealth building.',
            avatar: '💪',
            color: '#DC2626',
            greeting: "Hey there! Before we talk investing, let's make sure your financial house is in order. No debt, emergency fund in place, then we build wealth. Ready to win with money?",
            quickPrompts: [
                "Should I invest or pay off debt?",
                "How much emergency fund do I need?",
                "What are baby steps to wealth?",
                "Is this investment too risky?"
            ]
        },
        {
            id: 'ocallaghan',
            name: "Colleen O'Callaghan",
            title: 'The Balanced Advisor',
            style: 'Holistic Wealth Management',
            description: 'Balanced approach combining growth and security, with emphasis on financial education and empowerment.',
            avatar: '⚖️',
            color: '#059669',
            greeting: "Hi! I believe in empowering you with knowledge to make confident financial decisions. Let's explore your options together and find the right balance for your journey.",
            quickPrompts: [
                "How do I start investing?",
                "Explain stocks vs bonds",
                "What's a balanced portfolio?",
                "How do I manage investment emotions?"
            ]
        },
        {
            id: 'lynch',
            name: 'Peter Lynch',
            title: 'The Growth Seeker',
            style: 'Growth Investing',
            description: 'Invest in what you know. Find growth companies before Wall Street discovers them.',
            avatar: '🔍',
            color: '#2563EB',
            greeting: "Welcome! The best investment ideas are often right in front of you. What products do you love? What stores are always crowded? Let's find your edge together!",
            quickPrompts: [
                "How do I find good stocks?",
                "What does 'invest in what you know' mean?",
                "How do I research a company?",
                "What's a ten-bagger?"
            ]
        },
        {
            id: 'cramer',
            name: 'Jim Cramer',
            title: 'The Market Enthusiast',
            style: 'Active Trading',
            description: 'High-energy market analysis with focus on current trends, momentum, and staying informed.',
            avatar: '📺',
            color: '#EA580C',
            greeting: "BOOM! Welcome to the show! Markets are moving and there's always something happening. Let's talk about what's hot, what's not, and how to stay ahead of the game!",
            quickPrompts: [
                "What's moving the market today?",
                "Is now a good time to buy?",
                "How do I spot trends?",
                "What should I watch out for?"
            ]
        }
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSelectAdvisor = (advisor) => {
        setSelectedAdvisor(advisor);
        setMessages([
            {
                id: 1,
                type: 'ai',
                messageType: 'greeting',
                content: advisor.greeting,
                timestamp: new Date()
            },
            {
                id: 2,
                type: 'ai',
                messageType: 'portfolio-insight',
                content: `I can see you have a ${portfolioData.riskProfile.toLowerCase()} risk profile with ${portfolioData.holdings.length} holdings. Your portfolio is ${portfolioData.todayChangePercent.startsWith('+') ? 'up' : 'down'} ${portfolioData.todayChangePercent} today. ${portfolioData.topPerformer.symbol} is your top performer at ${portfolioData.topPerformer.change}.`,
                timestamp: new Date()
            }
        ]);
    };

    const handleSendMessage = (content) => {
        if (!content.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            type: 'user',
            messageType: 'standard',
            content: content.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI response (placeholder until API integration)
        setTimeout(() => {
            const response = getPlaceholderResponse(selectedAdvisor, content);
            const aiMessages = [];

            // Main response
            aiMessages.push({
                id: messages.length + 2,
                type: 'ai',
                messageType: response.type,
                content: response.content,
                timestamp: new Date()
            });

            // Sometimes add an educational callout
            if (response.education) {
                aiMessages.push({
                    id: messages.length + 3,
                    type: 'ai',
                    messageType: 'education',
                    title: response.education.title,
                    content: response.education.content,
                    timestamp: new Date()
                });
            }

            // Sometimes reference portfolio
            if (response.portfolioRef) {
                aiMessages.push({
                    id: messages.length + 4,
                    type: 'ai',
                    messageType: 'portfolio-reference',
                    holdings: response.portfolioRef,
                    timestamp: new Date()
                });
            }

            setMessages(prev => [...prev, ...aiMessages]);
            setIsTyping(false);
        }, 1500 + Math.random() * 1000);
    };

    const getPlaceholderResponse = (advisor, question) => {
        const lowerQuestion = question.toLowerCase();
        
        // Check for portfolio-related questions
        if (lowerQuestion.includes('portfolio') || lowerQuestion.includes('holdings') || lowerQuestion.includes('my stocks')) {
            return {
                type: 'standard',
                content: getAdvisorResponse(advisor, 'portfolio'),
                portfolioRef: portfolioData.holdings.slice(0, 2)
            };
        }

        // Check for educational questions
        if (lowerQuestion.includes('what is') || lowerQuestion.includes('explain') || lowerQuestion.includes('how do')) {
            return {
                type: 'standard',
                content: getAdvisorResponse(advisor, 'educational'),
                education: {
                    title: '💡 Key Concept',
                    content: getEducationalContent(lowerQuestion)
                }
            };
        }

        // Check for risk questions
        if (lowerQuestion.includes('risk') || lowerQuestion.includes('volatile') || lowerQuestion.includes('safe')) {
            return {
                type: 'standard',
                content: getAdvisorResponse(advisor, 'risk'),
                education: {
                    title: '⚠️ Risk Insight',
                    content: 'Risk tolerance varies by individual. Consider your time horizon, financial goals, and how you\'d feel if your portfolio dropped 20% temporarily.'
                }
            };
        }

        return {
            type: 'standard',
            content: getAdvisorResponse(advisor, 'general')
        };
    };

    const getAdvisorResponse = (advisor, topic) => {
        const responses = {
            buffett: {
                portfolio: "Looking at your holdings, I see a mix of growth and value. Remember, it's far better to buy a wonderful company at a fair price than a fair company at a wonderful price.",
                educational: "That's a great question. Let me explain this the way I think about it - always in terms of underlying business value.",
                risk: "Risk comes from not knowing what you're doing. The best way to minimize risk is to think carefully and invest in businesses you understand.",
                general: "Remember, price is what you pay, value is what you get. Let's think about this from a long-term business perspective."
            },
            montaperto: {
                portfolio: "Your portfolio shows thoughtful diversification. Let's ensure these holdings align with your specific financial timeline and goals.",
                educational: "Great question! Understanding these fundamentals is key to making confident financial decisions.",
                risk: "Risk management is about balance. Your moderate risk profile suggests we should blend growth potential with stability.",
                general: "Let's think about this strategically, considering both your short-term needs and long-term objectives."
            },
            ramsey: {
                portfolio: "I see you've got some holdings here. But first - are you debt-free? Do you have 3-6 months expenses saved? Those come before investing!",
                educational: "Listen, this stuff isn't complicated, but it does require discipline. Let me break it down simply.",
                risk: "The best investment is paying off debt. After that, slow and steady wins the race. No get-rich-quick schemes!",
                general: "Here's the deal - building wealth is a marathon, not a sprint. Let's make sure you're doing this the right way."
            },
            ocallaghan: {
                portfolio: "Your holdings show you're building a foundation. Let's discuss how these fit into your overall financial picture.",
                educational: "I love that you're asking questions! Knowledge is power when it comes to your finances.",
                risk: "Understanding risk is crucial. Let's explore what level of volatility you're truly comfortable with.",
                general: "Let's look at this from multiple angles so you can make the most informed decision for your situation."
            },
            lynch: {
                portfolio: "Interesting holdings! Do you use Apple products? Shop at places that sell Tesla? Investing in what you know gives you an edge.",
                educational: "Here's how I think about it - the best research often comes from your own observations as a consumer.",
                risk: "The key to managing risk is understanding what you own. If you can't explain why you own something, that's risky.",
                general: "Let's think about this practically. What companies do you interact with every day that seem to be doing well?"
            },
            cramer: {
                portfolio: "BOOM! Let's look at what you've got! Tesla's moving, crypto's volatile - there's always action in this portfolio!",
                educational: "Great question! You've got to understand this stuff to stay ahead of the game. Here's the breakdown!",
                risk: "Look, markets are risky - that's the game! But homework and diversification help you sleep at night!",
                general: "Here's my take - and remember, do your homework! Don't just take my word for it, do the research!"
            }
        };

        return responses[advisor.id]?.[topic] || responses[advisor.id]?.general;
    };

    const getEducationalContent = (question) => {
        if (question.includes('diversif')) {
            return "Diversification means spreading investments across different assets to reduce risk. If one investment falls, others may hold steady or rise.";
        }
        if (question.includes('value invest')) {
            return "Value investing focuses on finding stocks trading below their intrinsic worth. It requires patience and fundamental analysis.";
        }
        if (question.includes('etf') || question.includes('index')) {
            return "ETFs (Exchange-Traded Funds) let you invest in many stocks at once, providing instant diversification at low cost.";
        }
        if (question.includes('dividend')) {
            return "Dividends are portions of company profits paid to shareholders. Dividend yield = annual dividend ÷ stock price.";
        }
        return "This is a fundamental concept in investing. Understanding it will help you make more informed decisions about your portfolio.";
    };

    const handleQuickPrompt = (prompt) => {
        handleSendMessage(prompt);
    };

    const handleBackToSelection = () => {
        setSelectedAdvisor(null);
        setMessages([]);
    };

    const togglePortfolioPanel = () => {
        setShowPortfolioPanel(!showPortfolioPanel);
    };

    // Render different message types
    const renderMessage = (message) => {
        switch (message.messageType) {
            case 'education':
                return (
                    <div className={styles.educationCallout}>
                        <div className={styles.educationHeader}>
                            <span className={styles.educationIcon}>💡</span>
                            <span className={styles.educationTitle}>{message.title}</span>
                        </div>
                        <p className={styles.educationContent}>{message.content}</p>
                    </div>
                );
            
            case 'portfolio-reference':
                return (
                    <div className={styles.portfolioReference}>
                        <div className={styles.portfolioRefHeader}>
                            <span>📊 Referenced Holdings</span>
                        </div>
                        <div className={styles.portfolioRefList}>
                            {message.holdings.map((holding, idx) => (
                                <div key={idx} className={styles.portfolioRefItem}>
                                    <span className={styles.refSymbol}>{holding.symbol}</span>
                                    <span className={styles.refValue}>{holding.value}</span>
                                    <span className={`${styles.refChange} ${holding.positive ? styles.positive : styles.negative}`}>
                                        {holding.change}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'portfolio-insight':
                return (
                    <div 
                        className={styles.messageBubble}
                        style={{ '--advisor-color': selectedAdvisor.color }}
                    >
                        <div className={styles.insightBadge}>
                            <span>📈</span> Portfolio Insight
                        </div>
                        {message.content}
                    </div>
                );
            
            default:
                return (
                    <div 
                        className={styles.messageBubble}
                        style={message.type === 'ai' ? { '--advisor-color': selectedAdvisor.color } : {}}
                    >
                        {message.content}
                    </div>
                );
        }
    };

    // Advisor Selection Screen
    if (!selectedAdvisor) {
        return (
            <div className={styles.container}>
                <div className={styles.selectionHeader}>
                    <h1 className={styles.title}>AI Advisor</h1>
                    <p className={styles.subtitle}>
                        Choose your investment mentor. Each advisor brings a unique philosophy and approach.
                    </p>
                </div>

                <div className={styles.advisorGrid}>
                    {advisors.map((advisor) => (
                        <div
                            key={advisor.id}
                            className={styles.advisorCard}
                            onClick={() => handleSelectAdvisor(advisor)}
                            style={{ '--advisor-color': advisor.color }}
                        >
                            <div className={styles.advisorAvatar}>{advisor.avatar}</div>
                            <div className={styles.advisorInfo}>
                                <h3 className={styles.advisorName}>{advisor.name}</h3>
                                <span className={styles.advisorTitle}>{advisor.title}</span>
                                <span className={styles.advisorStyle}>{advisor.style}</span>
                                <p className={styles.advisorDescription}>{advisor.description}</p>
                            </div>
                            <button className={styles.selectButton}>
                                Start Chat →
                            </button>
                        </div>
                    ))}
                </div>

                <div className={styles.disclaimer}>
                    <span className={styles.disclaimerIcon}>ℹ️</span>
                    <p>
                        <strong>Educational Purpose Only:</strong> AI advisors provide simulated educational guidance 
                        based on famous investing philosophies. This is not real financial advice. Always consult 
                        a licensed financial advisor for personal investment decisions.
                    </p>
                </div>
            </div>
        );
    }

    // Chat Interface
    return (
        <div className={styles.chatContainer}>
            {/* Chat Header */}
            <div 
                className={styles.chatHeader}
                style={{ '--advisor-color': selectedAdvisor.color }}
            >
                <button className={styles.backButton} onClick={handleBackToSelection}>
                    ← Back
                </button>
                <div className={styles.chatHeaderInfo}>
                    <div className={styles.chatAvatar}>{selectedAdvisor.avatar}</div>
                    <div>
                        <h2 className={styles.chatAdvisorName}>{selectedAdvisor.name}</h2>
                        <span className={styles.chatAdvisorStyle}>{selectedAdvisor.style}</span>
                    </div>
                </div>
                <button 
                    className={`${styles.portfolioToggle} ${showPortfolioPanel ? styles.active : ''}`}
                    onClick={togglePortfolioPanel}
                >
                    📊 Portfolio
                </button>
            </div>

            <div className={styles.chatBody}>
                {/* Portfolio Context Panel */}
                <div className={`${styles.portfolioPanel} ${showPortfolioPanel ? styles.open : ''}`}>
                    <div className={styles.portfolioPanelHeader}>
                        <h3>Your Portfolio</h3>
                        <button className={styles.panelClose} onClick={togglePortfolioPanel}>×</button>
                    </div>
                    
                    <div className={styles.portfolioSummary}>
                        <div className={styles.portfolioTotal}>
                            <span className={styles.portfolioLabel}>Total Value</span>
                            <span className={styles.portfolioValue}>{portfolioData.totalValue}</span>
                            <span className={`${styles.portfolioChange} ${styles.positive}`}>
                                {portfolioData.todayChange} ({portfolioData.todayChangePercent})
                            </span>
                        </div>
                        
                        <div className={styles.portfolioMeta}>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Cash</span>
                                <span className={styles.metaValue}>{portfolioData.cashAvailable}</span>
                            </div>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Risk Profile</span>
                                <span className={styles.metaValue}>{portfolioData.riskProfile}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.holdingsList}>
                        <h4>Holdings</h4>
                        {portfolioData.holdings.map((holding, idx) => (
                            <div key={idx} className={styles.holdingItem}>
                                <div className={styles.holdingMain}>
                                    <span className={styles.holdingSymbol}>{holding.symbol}</span>
                                    <span className={styles.holdingName}>{holding.name}</span>
                                </div>
                                <div className={styles.holdingData}>
                                    <span className={styles.holdingValue}>{holding.value}</span>
                                    <span className={`${styles.holdingChange} ${holding.positive ? styles.positive : styles.negative}`}>
                                        {holding.change}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.panelInsights}>
                        <div className={styles.insightItem}>
                            <span className={styles.insightLabel}>🚀 Top Performer</span>
                            <span className={styles.insightValue}>{portfolioData.topPerformer.symbol} {portfolioData.topPerformer.change}</span>
                        </div>
                        <div className={styles.insightItem}>
                            <span className={styles.insightLabel}>📉 Needs Attention</span>
                            <span className={styles.insightValue}>{portfolioData.topLoser.symbol} {portfolioData.topLoser.change}</span>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className={styles.messagesArea}>
                    <div className={styles.messagesWrapper}>
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`${styles.message} ${message.type === 'user' ? styles.userMessage : styles.aiMessage}`}
                            >
                                {message.type === 'ai' && message.messageType !== 'education' && message.messageType !== 'portfolio-reference' && (
                                    <div className={styles.messageAvatar}>{selectedAdvisor.avatar}</div>
                                )}
                                {renderMessage(message)}
                            </div>
                        ))}

                        {isTyping && (
                            <div className={`${styles.message} ${styles.aiMessage}`}>
                                <div className={styles.messageAvatar}>{selectedAdvisor.avatar}</div>
                                <div className={styles.typingIndicator}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </div>

            {/* Quick Prompts */}
            <div className={styles.quickPrompts}>
                {selectedAdvisor.quickPrompts.map((prompt, index) => (
                    <button
                        key={index}
                        className={styles.quickPromptBtn}
                        onClick={() => handleQuickPrompt(prompt)}
                    >
                        {prompt}
                    </button>
                ))}
            </div>

            {/* Input Area */}
            <div className={styles.inputArea}>
                <div className={styles.inputWrapper}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                        placeholder={`Ask ${selectedAdvisor.name.split(' ')[0]} a question...`}
                        className={styles.chatInput}
                    />
                    <button
                        className={styles.sendButton}
                        onClick={() => handleSendMessage(inputValue)}
                        disabled={!inputValue.trim()}
                        style={{ '--advisor-color': selectedAdvisor.color }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                        </svg>
                    </button>
                </div>
                <p className={styles.inputDisclaimer}>
                    Educational simulation only • Not real financial advice
                </p>
            </div>
        </div>
    );
};

export default AIAdvisorView;
