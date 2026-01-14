import { useState, useRef, useEffect } from 'react';
import { Menu, Bot, Palette, BarChart3, Download, X, Send, Copy, Check, Diamond, Rocket, TrendingUp, DollarSign, Star, Zap, Target, Shield, Scale, Flame, Leaf, Building2, Sprout, Lightbulb, AlertTriangle } from 'lucide-react';
import styles from './AIAdvisorView.module.css';

const AIAdvisorView = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showPortfolioPanel, setShowPortfolioPanel] = useState(false);
    const [showStyleSelector, setShowStyleSelector] = useState(false);
    const [showHistorySidebar, setShowHistorySidebar] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
    const messagesEndRef = useRef(null);

    const chatHistory = [
        { id: 1, title: 'Portfolio diversification', date: 'Today', preview: 'How should I diversify my...' },
        { id: 2, title: 'Value investing basics', date: 'Yesterday', preview: 'What makes a stock undervalued...' },
        { id: 3, title: 'Risk tolerance assessment', date: 'Jan 10', preview: 'How do I know my risk...' },
        { id: 4, title: 'ETF vs mutual funds', date: 'Jan 8', preview: 'What are the differences...' },
        { id: 5, title: 'Dividend strategies', date: 'Jan 5', preview: 'How do I build passive income...' },
    ];

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
    };

    const styleCategories = [
        {
            category: 'By Philosophy',
            styles: [
                { id: 'value', name: 'Value Investing', icon: Diamond, description: 'Find undervalued stocks', color: '#1E3A5F' },
                { id: 'growth', name: 'Growth Investing', icon: Rocket, description: 'Target high growth potential', color: '#7C3AED' },
                { id: 'momentum', name: 'Momentum Investing', icon: TrendingUp, description: 'Follow market trends', color: '#EA580C' },
                { id: 'income', name: 'Income Investing', icon: DollarSign, description: 'Generate regular income', color: '#059669' },
                { id: 'quality', name: 'Quality Investing', icon: Star, description: 'Strong fundamentals', color: '#2563EB' },
            ]
        },
        {
            category: 'By Strategy',
            styles: [
                { id: 'active', name: 'Active Investing', icon: Zap, description: 'Frequent trading', color: '#DC2626' },
                { id: 'passive', name: 'Passive Investing', icon: Target, description: 'Index fund approach', color: '#0891B2' },
            ]
        },
        {
            category: 'By Risk Tolerance',
            styles: [
                { id: 'conservative', name: 'Conservative', icon: Shield, description: 'Capital preservation', color: '#4B5563' },
                { id: 'moderate', name: 'Moderate', icon: Scale, description: 'Balanced approach', color: '#8B5CF6' },
                { id: 'aggressive', name: 'Aggressive', icon: Flame, description: 'Maximum returns', color: '#EF4444' },
            ]
        },
        {
            category: 'By Focus',
            styles: [
                { id: 'esg', name: 'ESG Investing', icon: Leaf, description: 'Socially responsible', color: '#10B981' },
                { id: 'largecap', name: 'Large-Cap Focus', icon: Building2, description: 'Established companies', color: '#6366F1' },
                { id: 'smallcap', name: 'Small-Cap Focus', icon: Sprout, description: 'Growth potential', color: '#F59E0B' },
            ]
        }
    ];

    const getQuickPrompts = () => {
        if (!selectedStyle) {
            return [
                "What should I know as a beginner?",
                "How do I start investing?",
                "Explain my portfolio performance",
                "What's the difference between stocks and bonds?",
            ];
        }
        const stylePrompts = {
            value: ["How do I find undervalued stocks?", "What metrics indicate good value?", "Explain intrinsic value"],
            growth: ["How do I identify growth stocks?", "What's a reasonable P/E for growth?", "Growth vs value?"],
            momentum: ["What's trending in the market?", "How do I spot momentum?", "When to exit momentum trades?"],
            income: ["What's a good dividend yield?", "How do I build passive income?", "Dividend stocks vs bonds?"],
            quality: ["What makes a quality company?", "How do I evaluate fundamentals?", "Quality vs growth?"],
            active: ["How often should I trade?", "What are active trading risks?", "How to time the market?"],
            passive: ["Best index funds to consider?", "How to set and forget?", "Active vs passive performance?"],
            conservative: ["What are safest investments?", "How to protect capital?", "Government bonds vs savings?"],
            moderate: ["What's a balanced allocation?", "How to diversify properly?", "60/40 portfolio relevance?"],
            aggressive: ["High-growth opportunities?", "How much volatility is too much?", "Alternative investments?"],
            esg: ["How to invest sustainably?", "What ESG factors matter?", "Do ESG funds underperform?"],
            largecap: ["Best blue chip stocks?", "Large vs small-cap returns?", "Large company stability?"],
            smallcap: ["How to find small-cap gems?", "Small-cap risks?", "When do small-caps outperform?"],
        };
        return stylePrompts[selectedStyle.id] || stylePrompts.value;
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{
                id: 1,
                type: 'ai',
                messageType: 'greeting',
                content: "Hello! I'm your AI financial education advisor. I can help you learn about investing, understand your portfolio, and explore different strategies. Feel free to ask me anything, or select an investing style from the toolbar to get perspective-specific guidance.",
                timestamp: new Date()
            }]);
        }
    }, []);

    const handleStyleSelect = (style) => {
        setSelectedStyle(style);
        setShowStyleSelector(false);
        const styleMessage = {
            id: messages.length + 1,
            type: 'ai',
            messageType: 'style-change',
            style: style,
            content: `I'll now provide guidance from a ${style.name.toLowerCase()} perspective. ${style.description}. Feel free to ask me questions with this approach in mind!`,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, styleMessage]);
    };

    const handleClearStyle = () => {
        setSelectedStyle(null);
        const message = {
            id: messages.length + 1,
            type: 'ai',
            messageType: 'standard',
            content: "I've switched back to general guidance mode. I'll provide balanced educational information without a specific investing style bias.",
            timestamp: new Date()
        };
        setMessages(prev => [...prev, message]);
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

        setTimeout(() => {
            const response = getPlaceholderResponse(content);
            const aiMessages = [];

            aiMessages.push({
                id: messages.length + 2,
                type: 'ai',
                messageType: response.type,
                content: response.content,
                timestamp: new Date()
            });

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

    const getPlaceholderResponse = (question) => {
        const lowerQuestion = question.toLowerCase();
        const styleContext = selectedStyle ? ` From a ${selectedStyle.name.toLowerCase()} perspective,` : '';
        
        if (lowerQuestion.includes('portfolio') || lowerQuestion.includes('holdings')) {
            return {
                type: 'standard',
                content: `${styleContext} looking at your portfolio, I can see you have a diversified mix of assets. Your total value is ${portfolioData.totalValue} with ${portfolioData.holdings.length} holdings.`,
                portfolioRef: portfolioData.holdings.slice(0, 2)
            };
        }

        if (lowerQuestion.includes('what is') || lowerQuestion.includes('explain') || lowerQuestion.includes('how do')) {
            return {
                type: 'standard',
                content: `${styleContext} that's a great question for building your investment knowledge.`,
                education: {
                    title: 'Key Concept',
                    content: 'Understanding these fundamentals is crucial for making informed investment decisions.'
                }
            };
        }

        if (lowerQuestion.includes('risk')) {
            return {
                type: 'standard',
                content: `${styleContext} understanding risk is crucial for any investor.`,
                education: {
                    title: 'Risk Insight',
                    content: 'Risk tolerance varies by individual. Consider your time horizon and financial goals.'
                }
            };
        }

        return {
            type: 'standard',
            content: `${styleContext} That's a thoughtful question. Let me share some educational insights.`
        };
    };

    const handleCopyMessage = (messageId, content) => {
        navigator.clipboard.writeText(content);
        setCopiedId(messageId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleExportChat = () => {
        const chatContent = messages.map(m => 
            `[${formatTime(m.timestamp)}] ${m.type === 'user' ? 'You' : 'AI Advisor'}: ${m.content}`
        ).join('\n\n');
        
        const blob = new Blob([chatContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-export-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleNewChat = () => {
        setMessages([{
            id: 1,
            type: 'ai',
            messageType: 'greeting',
            content: "Hello! I'm your AI financial education advisor. How can I help you today?",
            timestamp: new Date()
        }]);
        setSelectedStyle(null);
    };

    const renderMessage = (message, index) => {
        const isLatest = index === messages.length - 1;
        
        switch (message.messageType) {
            case 'style-change':
                const StyleIcon = message.style.icon;
                return (
                    <div className={`${styles.styleChangeBubble} ${isLatest ? styles.slideIn : ''}`} style={{ '--style-color': message.style.color }}>
                        <div className={styles.styleChangeHeader}>
                            <StyleIcon size={20} className={styles.styleIcon} />
                            <span className={styles.styleName}>{message.style.name}</span>
                        </div>
                        <p>{message.content}</p>
                        <span className={styles.timestamp}>{formatTime(message.timestamp)}</span>
                    </div>
                );

            case 'education':
                return (
                    <div className={`${styles.educationCallout} ${isLatest ? styles.slideIn : ''}`}>
                        <div className={styles.educationHeader}>
                            <Lightbulb size={18} />
                            <span className={styles.educationTitle}>{message.title}</span>
                        </div>
                        <p className={styles.educationContent}>{message.content}</p>
                    </div>
                );
            
            case 'portfolio-reference':
                return (
                    <div className={`${styles.portfolioReference} ${isLatest ? styles.slideIn : ''}`}>
                        <div className={styles.portfolioRefHeader}>
                            <BarChart3 size={16} />
                            <span>Referenced Holdings</span>
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
            
            default:
                return (
                    <div className={`${styles.messageBubble} ${isLatest ? styles.slideIn : ''}`}>
                        {message.content}
                        <div className={styles.messageFooter}>
                            <span className={styles.timestamp}>{formatTime(message.timestamp)}</span>
                            {message.type === 'ai' && (
                                <button 
                                    className={styles.copyBtn}
                                    onClick={() => handleCopyMessage(message.id, message.content)}
                                >
                                    {copiedId === message.id ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                                </button>
                            )}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className={styles.chatContainer}>
            {/* Header */}
            <div className={styles.chatHeader}>
                <button className={styles.historyToggle} onClick={() => setShowHistorySidebar(!showHistorySidebar)}>
                    <Menu size={20} />
                </button>
                <div className={styles.chatHeaderInfo}>
                    <div className={`${styles.chatAvatar} ${isTyping ? styles.pulse : ''}`}>
                        <Bot size={24} />
                    </div>
                    <div>
                        <h2 className={styles.chatAdvisorName}>AI Financial Advisor</h2>
                        <span className={styles.chatAdvisorStyle}>
                            {selectedStyle ? (
                                <>
                                    <span className={styles.activeStyleBadge} style={{ '--style-color': selectedStyle.color }}>
                                        {(() => {
                                            const Icon = selectedStyle.icon;
                                            return <Icon size={14} />;
                                        })()}
                                        {selectedStyle.name}
                                    </span>
                                    <button className={styles.clearStyleBtn} onClick={handleClearStyle}>
                                        <X size={14} />
                                    </button>
                                </>
                            ) : (
                                <span className={styles.onlineStatus}>Online</span>
                            )}
                        </span>
                    </div>
                </div>
                <div className={styles.headerActions}>
                    <button 
                        className={`${styles.headerButton} ${showStyleSelector ? styles.active : ''}`}
                        onClick={() => setShowStyleSelector(!showStyleSelector)}
                        title="Change Style"
                    >
                        <Palette size={20} />
                    </button>
                    <button 
                        className={`${styles.headerButton} ${showPortfolioPanel ? styles.active : ''}`}
                        onClick={() => setShowPortfolioPanel(!showPortfolioPanel)}
                        title="Portfolio"
                    >
                        <BarChart3 size={20} />
                    </button>
                    <button className={styles.headerButton} onClick={handleExportChat} title="Export Chat">
                        <Download size={20} />
                    </button>
                </div>
            </div>

            {/* Style Selector */}
            {showStyleSelector && (
                <div className={styles.styleSelector}>
                    <div className={styles.styleSelectorHeader}>
                        <h3>Choose an Investing Style</h3>
                        <p>Get guidance from a specific perspective</p>
                    </div>
                    <div className={styles.styleCategories}>
                        {styleCategories.map((category, idx) => (
                            <div key={idx} className={styles.styleCategory}>
                                <h4>{category.category}</h4>
                                <div className={styles.styleOptions}>
                                    {category.styles.map((style) => {
                                        const StyleIcon = style.icon;
                                        return (
                                            <button
                                                key={style.id}
                                                className={`${styles.styleOption} ${selectedStyle?.id === style.id ? styles.selected : ''}`}
                                                onClick={() => handleStyleSelect(style)}
                                                style={{ '--style-color': style.color }}
                                            >
                                                <StyleIcon size={18} className={styles.styleOptionIcon} />
                                                <span className={styles.styleOptionName}>{style.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className={styles.chatBody}>
                {/* History Sidebar */}
                <div className={`${styles.historySidebar} ${showHistorySidebar ? styles.open : ''}`}>
                    <div className={styles.sidebarHeader}>
                        <h3>Chat History</h3>
                        <button className={styles.newChatBtn} onClick={handleNewChat}>+ New Chat</button>
                    </div>
                    <div className={styles.historyList}>
                        {chatHistory.map((chat) => (
                            <div key={chat.id} className={styles.historyItem}>
                                <div className={styles.historyTitle}>{chat.title}</div>
                                <div className={styles.historyPreview}>{chat.preview}</div>
                                <div className={styles.historyDate}>{chat.date}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Portfolio Panel */}
                <div className={`${styles.portfolioPanel} ${showPortfolioPanel ? styles.open : ''}`}>
                    <div className={styles.portfolioPanelHeader}>
                        <h3>Your Portfolio</h3>
                        <button className={styles.panelClose} onClick={() => setShowPortfolioPanel(false)}>
                            <X size={20} />
                        </button>
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
                                <span className={styles.metaLabel}>Risk</span>
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
                </div>

                {/* Messages Area */}
                <div className={styles.messagesArea}>
                    <div className={styles.messagesWrapper}>
                        {messages.map((message, index) => (
                            <div
                                key={message.id}
                                className={`${styles.message} ${message.type === 'user' ? styles.userMessage : styles.aiMessage}`}
                            >
                                {message.type === 'ai' && message.messageType !== 'education' && message.messageType !== 'portfolio-reference' && (
                                    <div className={`${styles.messageAvatar} ${isTyping && index === messages.length - 1 ? styles.pulse : ''}`}>
                                        <Bot size={18} />
                                    </div>
                                )}
                                {renderMessage(message, index)}
                            </div>
                        ))}

                        {isTyping && (
                            <div className={`${styles.message} ${styles.aiMessage}`}>
                                <div className={`${styles.messageAvatar} ${styles.pulse}`}>
                                    <Bot size={18} />
                                </div>
                                <div className={styles.typingIndicator}>
                                    <span className={styles.typingText}>Typing</span>
                                    <span className={styles.typingDots}>
                                        <span>.</span><span>.</span><span>.</span>
                                    </span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </div>

            {/* Quick Prompts */}
            <div className={styles.quickPrompts}>
                {getQuickPrompts().map((prompt, index) => (
                    <button
                        key={index}
                        className={styles.quickPromptBtn}
                        onClick={() => handleSendMessage(prompt)}
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
                        placeholder={selectedStyle ? `Ask about ${selectedStyle.name.toLowerCase()}...` : "Ask me anything about investing..."}
                        className={styles.chatInput}
                    />
                    <button
                        className={styles.sendButton}
                        onClick={() => handleSendMessage(inputValue)}
                        disabled={!inputValue.trim()}
                    >
                        <Send size={20} />
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
