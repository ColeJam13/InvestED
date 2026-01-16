import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, BookOpen, HelpCircle, Brain, ChevronDown, Lightbulb, MessageSquare } from 'lucide-react';
import styles from './ChatWidget.module.css';

const ChatWidget = ({ currentLesson = null }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const quickActions = [
        { icon: Lightbulb, label: 'Explain simply', prompt: 'Can you explain this concept in simpler terms?' },
        { icon: BookOpen, label: 'Give example', prompt: 'Can you give me a real-world example?' },
        { icon: Brain, label: 'Quiz me', prompt: 'Quiz me on what I just learned!' },
        { icon: HelpCircle, label: 'Why important?', prompt: 'Why is this important to understand?' },
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Welcome message when first opened
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcomeMessage = currentLesson 
                ? `Hi! I'm your AI learning assistant. I see you're studying "${currentLesson}". Ask me anything about this topic, or use the quick actions below!`
                : "Hi! I'm your AI learning assistant. I can help explain investment concepts, give examples, or quiz you on what you've learned. How can I help?";
            
            setMessages([{
                id: 1,
                type: 'ai',
                content: welcomeMessage,
                timestamp: new Date()
            }]);
        }
    }, [isOpen, currentLesson]);

    const generateAIResponse = (userMessage) => {
        // Simulated AI responses based on keywords
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('explain') || lowerMessage.includes('simpler')) {
            return "Think of it this way: investing is like planting a tree. You put in a seed (your money) today, and over time it grows into something much bigger. The key is patience - the longer you let it grow, the bigger it gets thanks to compound growth!";
        }
        
        if (lowerMessage.includes('example') || lowerMessage.includes('real-world')) {
            return "Here's a practical example: Let's say you invest $100 per month starting at age 25. With an average 7% annual return, by age 65 you'd have about $240,000 - but you only put in $48,000! The rest is growth from compound interest. That's the power of starting early.";
        }
        
        if (lowerMessage.includes('quiz')) {
            return "Let's test your knowledge! 🎯\n\nQuestion: If you invest $1,000 and earn 10% annually, how much would you have after 1 year?\n\nA) $1,000\nB) $1,100\nC) $1,010\nD) $900\n\nTake your time and reply with your answer!";
        }
        
        if (lowerMessage.includes('important') || lowerMessage.includes('why')) {
            return "Understanding this is crucial because it directly impacts your financial future. Studies show that people who understand basic investing concepts retire with 3x more savings than those who don't. Knowledge is literally wealth in this case!";
        }

        if (lowerMessage.includes('stock')) {
            return "Stocks represent ownership in a company. When you buy a stock, you're buying a tiny piece of that business. If the company does well, your piece becomes more valuable. It's like owning a slice of a pizza shop - when the shop profits, so do you!";
        }

        if (lowerMessage.includes('crypto') || lowerMessage.includes('bitcoin')) {
            return "Cryptocurrency is digital money that uses blockchain technology. Think of blockchain as a public notebook that everyone can see but no one can erase. Bitcoin was the first crypto, created in 2009. While exciting, crypto is very volatile - prices can swing 20% in a day!";
        }

        if (lowerMessage.includes('risk')) {
            return "Investment risk is the chance you might lose money. Generally, higher potential returns = higher risk. A savings account is low risk (but low return), while individual stocks are higher risk (but potentially higher return). The key is finding your comfort level!";
        }

        if (lowerMessage.includes('diversif')) {
            return "Diversification is the 'don't put all your eggs in one basket' strategy. By spreading investments across different types (stocks, bonds, real estate), you reduce risk. If one investment drops, others might rise, balancing things out.";
        }

        if (['a', 'b', 'c', 'd'].includes(lowerMessage.trim())) {
            if (lowerMessage.trim() === 'b') {
                return "🎉 Correct! $1,000 × 1.10 = $1,100. You've got a solid grasp of basic returns!\n\nWant another question, or shall we explore a different topic?";
            } else {
                return "Not quite! The answer is B) $1,100.\n\nHere's the math: $1,000 × 10% = $100 gain\n$1,000 + $100 = $1,100\n\nWant to try another question?";
            }
        }

        // Default response
        const responses = [
            "That's a great question! In investing, the key principle to remember is that time in the market beats timing the market. Start early, stay consistent, and let compound growth work its magic.",
            "Excellent thinking! The most successful investors focus on the long-term and don't panic during market dips. Remember: volatility is normal, and historically, markets have always recovered.",
            "I love your curiosity! One important concept is the risk-reward tradeoff. Generally, investments with higher potential returns come with higher risk. Finding the right balance depends on your goals and timeline.",
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    };

    const handleSend = (message = inputValue) => {
        if (!message.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            type: 'user',
            content: message,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI thinking
        setTimeout(() => {
            const aiResponse = {
                id: messages.length + 2,
                type: 'ai',
                content: generateAIResponse(message),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
            
            if (!isOpen) {
                setHasUnread(true);
            }
        }, 1000 + Math.random() * 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleOpen = () => {
        setIsOpen(true);
        setHasUnread(false);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    return (
        <div className={styles.widgetContainer}>
            {/* Chat Panel */}
            <div className={`${styles.chatPanel} ${isOpen ? styles.open : ''}`}>
                {/* Header */}
                <div className={styles.chatHeader}>
                    <div className={styles.headerInfo}>
                        <div className={styles.headerAvatar}>
                            <Bot size={20} />
                            <span className={styles.onlineIndicator} />
                        </div>
                        <div className={styles.headerText}>
                            <h3>AI Learning Assistant</h3>
                            <span className={styles.statusText}>Always here to help</span>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                        <ChevronDown size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className={styles.messagesContainer}>
                    {messages.map((message) => (
                        <div 
                            key={message.id} 
                            className={`${styles.message} ${message.type === 'user' ? styles.userMessage : styles.aiMessage}`}
                        >
                            {message.type === 'ai' && (
                                <div className={styles.messageAvatar}>
                                    <Bot size={16} />
                                </div>
                            )}
                            <div className={styles.messageContent}>
                                <p>{message.content}</p>
                                <span className={styles.messageTime}>{formatTime(message.timestamp)}</span>
                            </div>
                        </div>
                    ))}
                    
                    {isTyping && (
                        <div className={`${styles.message} ${styles.aiMessage}`}>
                            <div className={styles.messageAvatar}>
                                <Bot size={16} />
                            </div>
                            <div className={styles.typingIndicator}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                <div className={styles.quickActions}>
                    {quickActions.map((action, index) => (
                        <button 
                            key={index}
                            className={styles.quickActionBtn}
                            onClick={() => handleSend(action.prompt)}
                        >
                            <action.icon size={14} />
                            {action.label}
                        </button>
                    ))}
                </div>

                {/* Input */}
                <div className={styles.inputContainer}>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Ask me anything..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className={styles.input}
                    />
                    <button 
                        className={styles.sendBtn}
                        onClick={() => handleSend()}
                        disabled={!inputValue.trim()}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>

            {/* Floating Button */}
            <button 
                className={`${styles.floatingBtn} ${isOpen ? styles.hidden : ''}`}
                onClick={handleOpen}
            >
                <div className={styles.floatingBtnInner}>
                    <Sparkles size={24} />
                    {hasUnread && <span className={styles.unreadBadge} />}
                </div>
                <span className={styles.floatingBtnLabel}>Ask AI</span>
            </button>
        </div>
    );
};

export default ChatWidget;
