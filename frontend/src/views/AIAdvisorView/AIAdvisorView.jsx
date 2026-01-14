import { useState, useRef, useEffect } from 'react';
import { Menu, Bot, Palette, BarChart3, Download, X, Send, Copy, Check, Diamond, Rocket, TrendingUp, DollarSign, Star, Zap, Target, Shield, Scale, Flame, Leaf, Building2, Sprout, Lightbulb, AlertTriangle } from 'lucide-react';
import styles from './AIAdvisorView.module.css';
import { portfolioService } from '../../services/portfolioService';

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

    const userId = 1;
    const [portfolioData, setPortfolioData] = useState(null);
    const [portfolioLoading, setPortfolioLoading] = useState(true);
    const [portfolioError, setPortfolioError] = useState(null);

    // Fetch portfolio data when panel opens
    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                setPortfolioLoading(true);
                const [summary, positions] = await Promise.all([
                    portfolioService.getPortfolioSummary(userId),
                    portfolioService.getAllPositions(userId)
                ]);

                // Try to get risk profile
                let riskLevel = 'Not Set';
                try {
                    const risk = await portfolioService.getRiskProfile(userId);
                    if (risk) riskLevel = risk.riskLevel;
                } catch (e) {
                    console.log('Risk profile not available');
                }

                setPortfolioData({
                    totalValue: portfolioService.formatCurrency(summary.totalValue),
                    todayChange: portfolioService.formatCurrency(summary.totalGainLoss),
                    todayChangePercent: portfolioService.formatPercent(summary.totalGainLossPercent),
                    cashAvailable: portfolioService.formatCurrency(summary.totalCash),
                    riskProfile: riskLevel,
                    holdings: positions.map(p => ({
                        symbol: p.symbol,
                        name: p.name,
                        value: portfolioService.formatCurrency(p.quantity * p.currentPrice),
                        change: portfolioService.formatPercent(
                            ((p.currentPrice - p.averageBuyPrice) / p.averageBuyPrice) * 100
                        ),
                        positive: p.currentPrice >= p.averageBuyPrice
                    }))
                });
            } catch (err) {
                console.error('Error fetching portfolio data:', err);
                setPortfolioError('Failed to load portfolio');
            } finally {
                setPortfolioLoading(false);
            }
        };

        if (showPortfolioPanel) {
            fetchPortfolioData();
        }
    }, [showPortfolioPanel, userId]);

    const chatHistory = [
        { id: 1, title: 'Portfolio diversification', date: 'Today', preview: 'How should I diversify my...' },
        { id: 2, title: 'Value investing basics', date: 'Yesterday', preview: 'What makes a stock undervalued...' },
        { id: 3, title: 'Risk tolerance assessment', date: 'Jan 10', preview: 'How do I know my risk...' },
        { id: 4, title: 'ETF vs mutual funds', date: 'Jan 8', preview: 'What are the differences...' },
        { id: 5, title: 'Dividend strategies', date: 'Jan 5', preview: 'How do I build passive income...' },
    ];

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
            content: content,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        setTimeout(() => {
            let aiResponse;
            const lowerContent = content.toLowerCase();

            if (lowerContent.includes('portfolio') || lowerContent.includes('my holdings') || lowerContent.includes('my investments')) {
                const styleContext = selectedStyle ? `From a ${selectedStyle.name.toLowerCase()} perspective, ` : '';
                aiResponse = {
                    id: messages.length + 2,
                    type: 'ai',
                    messageType: 'portfolio-reference',
                    content: `${styleContext}looking at your portfolio, I can see you have a diversified mix of assets. Your total value is ${portfolioData?.totalValue || 'loading...'} with ${portfolioData?.holdings?.length || 0} holdings.`,
                    portfolioRef: portfolioData?.holdings?.slice(0, 2) || []
                };
            } else if (selectedStyle) {
                aiResponse = {
                    id: messages.length + 2,
                    type: 'ai',
                    messageType: 'standard',
                    content: `From a ${selectedStyle.name.toLowerCase()} lens: ${content}. This is a simulated response explaining the topic with emphasis on ${selectedStyle.description.toLowerCase()}. Key considerations include market analysis, risk assessment, and alignment with your investment goals.`
                };
            } else if (lowerContent.includes('learn') || lowerContent.includes('explain') || lowerContent.includes('what is')) {
                aiResponse = {
                    id: messages.length + 2,
                    type: 'ai',
                    messageType: 'education',
                    content: `Let me explain this concept: "${content}". This is an educational response that would cover key principles, practical examples, and important considerations for beginners.`,
                    educationTopic: content
                };
            } else {
                aiResponse = {
                    id: messages.length + 2,
                    type: 'ai',
                    messageType: 'standard',
                    content: `Great question! Regarding "${content}", here's what you should know: This is a simulated AI response that would provide thoughtful, educational guidance. In a real implementation, this would connect to a language model for dynamic responses.`
                };
            }

            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const handleCopyMessage = (messageId, content) => {
        navigator.clipboard.writeText(content);
        setCopiedId(messageId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleNewChat = () => {
        setMessages([{
            id: 1,
            type: 'ai',
            messageType: 'greeting',
            content: "Hello! I'm your AI financial education advisor. I can help you learn about investing, understand your portfolio, and explore different strategies. Feel free to ask me anything, or select an investing style from the toolbar to get perspective-specific guidance.",
            timestamp: new Date()
        }]);
        setSelectedStyle(null);
    };

    const renderMessage = (message, index) => {
        if (message.messageType === 'greeting') {
            return (
                <div className={styles.greetingBubble}>
                    <div className={styles.greetingHeader}>
                        <Bot size={32} className={styles.greetingIcon} />
                        <div className={styles.greetingTitle}>Welcome to InvestED AI Advisor</div>
                    </div>
                    <p className={styles.greetingText}>{message.content}</p>
                    <div className={styles.greetingFeatures}>
                        <div className={styles.featureItem}>
                            <Lightbulb size={16} />
                            <span>Learn investing concepts</span>
                        </div>
                        <div className={styles.featureItem}>
                            <Palette size={16} />
                            <span>Explore investing styles</span>
                        </div>
                        <div className={styles.featureItem}>
                            <BarChart3 size={16} />
                            <span>Understand your portfolio</span>
                        </div>
                    </div>
                </div>
            );
        }

        if (message.messageType === 'style-change') {
            const StyleIcon = message.style.icon;
            return (
                <div className={styles.styleChangeBubble} style={{ borderLeftColor: message.style.color }}>
                    <div className={styles.styleChangeHeader}>
                        <StyleIcon size={20} style={{ color: message.style.color }} />
                        <span className={styles.styleChangeTitle}>{message.style.name} Mode Activated</span>
                    </div>
                    <p className={styles.styleChangeText}>{message.content}</p>
                </div>
            );
        }

        if (message.messageType === 'education') {
            return (
                <div className={styles.educationBubble}>
                    <div className={styles.educationHeader}>
                        <Lightbulb size={18} className={styles.educationIcon} />
                        <span>Educational Content</span>
                    </div>
                    <div className={styles.educationContent}>
                        <p>{message.content}</p>
                    </div>
                    <div className={styles.messageActions}>
                        <button className={styles.actionBtn} onClick={() => handleCopyMessage(message.id, message.content)}>
                            {copiedId === message.id ? <Check size={14} /> : <Copy size={14} />}
                            {copiedId === message.id ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <span className={styles.messageTime}>{formatTime(message.timestamp)}</span>
                </div>
            );
        }

        if (message.messageType === 'portfolio-reference' && message.portfolioRef) {
            return (
                <div className={styles.portfolioBubble}>
                    <p className={styles.portfolioText}>{message.content}</p>
                    <div className={styles.portfolioSnapshot}>
                        {message.portfolioRef.map((holding, idx) => (
                            <div key={idx} className={styles.snapshotItem}>
                                <span className={styles.snapshotSymbol}>{holding.symbol}</span>
                                <span className={styles.snapshotValue}>{holding.value}</span>
                                <span className={`${styles.snapshotChange} ${holding.positive ? styles.positive : styles.negative}`}>
                                    {holding.change}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className={styles.messageActions}>
                        <button className={styles.actionBtn} onClick={() => handleCopyMessage(message.id, message.content)}>
                            {copiedId === message.id ? <Check size={14} /> : <Copy size={14} />}
                            {copiedId === message.id ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <span className={styles.messageTime}>{formatTime(message.timestamp)}</span>
                </div>
            );
        }

        if (message.type === 'user') {
            return (
                <div className={styles.userBubble}>
                    <p>{message.content}</p>
                    <span className={styles.messageTime}>{formatTime(message.timestamp)}</span>
                </div>
            );
        }

        return (
            <div className={styles.messageBubble}>
                <p>{message.content}</p>
                <div className={styles.messageActions}>
                    <button className={styles.actionBtn} onClick={() => handleCopyMessage(message.id, message.content)}>
                        {copiedId === message.id ? <Check size={14} /> : <Copy size={14} />}
                        {copiedId === message.id ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <span className={styles.messageTime}>{formatTime(message.timestamp)}</span>
            </div>
        );
    };

    return (
        <div className={styles.aiAdvisorView}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.toolbarLeft}>
                    <button className={styles.toolbarBtn} onClick={() => setShowHistorySidebar(!showHistorySidebar)}>
                        <Menu size={20} />
                    </button>
                    <div className={styles.toolbarTitle}>AI Financial Advisor</div>
                </div>
                <div className={styles.toolbarRight}>
                    {selectedStyle && (
                        <div className={styles.activeStyle} style={{ borderColor: selectedStyle.color }}>
                            {(() => {
                                const StyleIcon = selectedStyle.icon;
                                return <StyleIcon size={16} style={{ color: selectedStyle.color }} />;
                            })()}
                            <span>{selectedStyle.name}</span>
                            <button className={styles.clearStyleBtn} onClick={handleClearStyle}>
                                <X size={14} />
                            </button>
                        </div>
                    )}
                    <button
                        className={`${styles.toolbarBtn} ${showStyleSelector ? styles.active : ''}`}
                        onClick={() => setShowStyleSelector(!showStyleSelector)}
                        title="Select investing style"
                    >
                        <Palette size={20} />
                    </button>
                    <button
                        className={`${styles.toolbarBtn} ${showPortfolioPanel ? styles.active : ''}`}
                        onClick={() => setShowPortfolioPanel(!showPortfolioPanel)}
                        title="View portfolio"
                    >
                        <BarChart3 size={20} />
                    </button>
                    <button className={styles.toolbarBtn} title="Export chat">
                        <Download size={20} />
                    </button>
                </div>
            </div>

            {/* Style Selector Dropdown */}
            {showStyleSelector && (
                <div className={styles.styleSelector}>
                    <div className={styles.styleSelectorHeader}>
                        <h3>Select Investing Style</h3>
                        <button className={styles.closeStyleSelector} onClick={() => setShowStyleSelector(false)}>
                            <X size={20} />
                        </button>
                    </div>
                    <div className={styles.styleSelectorContent}>
                        {styleCategories.map((category) => (
                            <div key={category.category} className={styles.styleCategory}>
                                <h4 className={styles.categoryTitle}>{category.category}</h4>
                                <div className={styles.styleGrid}>
                                    {category.styles.map((style) => {
                                        const StyleIcon = style.icon;
                                        return (
                                            <button
                                                key={style.id}
                                                className={`${styles.styleOption} ${selectedStyle?.id === style.id ? styles.selectedOption : ''}`}
                                                onClick={() => handleStyleSelect(style)}
                                                style={{ borderLeftColor: style.color }}
                                            >
                                                <StyleIcon size={24} style={{ color: style.color }} />
                                                <div className={styles.styleOptionContent}>
                                                    <span className={styles.styleOptionName}>{style.name}</span>
                                                    <span className={styles.styleOptionDesc}>{style.description}</span>
                                                </div>
                                                {selectedStyle?.id === style.id && (
                                                    <Check size={18} className={styles.selectedCheck} />
                                                )}
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
                        {portfolioLoading ? (
                            <div className={styles.portfolioLoading}>
                                <div className={styles.spinner}></div>
                                <p>Loading portfolio...</p>
                            </div>
                        ) : portfolioError ? (
                            <div className={styles.portfolioError}>
                                <p>{portfolioError}</p>
                            </div>
                        ) : portfolioData ? (
                            <>
                                <div className={styles.portfolioTotal}>
                                    <span className={styles.portfolioLabel}>Total Value</span>
                                    <span className={styles.portfolioValue}>{portfolioData.totalValue}</span>
                                    <span className={`${styles.portfolioChange} ${portfolioData.todayChange.includes('+') ? styles.positive : styles.negative}`}>
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
                            </>
                        ) : null}
                    </div>
                    <div className={styles.holdingsList}>
                        <h4>Holdings</h4>
                        {portfolioLoading ? (
                            <div className={styles.portfolioLoading}>Loading...</div>
                        ) : portfolioError ? (
                            <div className={styles.portfolioError}>{portfolioError}</div>
                        ) : portfolioData && portfolioData.holdings.length > 0 ? (
                            portfolioData.holdings.map((holding, idx) => (
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
                            ))
                        ) : (
                            <div className={styles.noHoldings}>
                                <p>No holdings yet</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    Start investing to see your portfolio here!
                                </p>
                            </div>
                        )}
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
