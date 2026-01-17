import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';
import {
  Menu, Bot, Palette, BarChart3, Download, X, Send, Copy, Check,
  Diamond, Rocket, TrendingUp, DollarSign, Star, Zap, Target,
  Shield, Scale, Flame, Leaf, Building2, Sprout, Lightbulb
} from 'lucide-react';
import styles from './AIAdvisorView.module.css';
import { portfolioService } from '../../services/portfolioService';
import { aiService } from '../../services/aiService';

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

  // message id counter so async doesn't mess up ids
  const messageIdRef = useRef(0);

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
            symbol: p.symbol.replace('CRYPTO:', ''),
            name: p.name.replace('CRYPTO:', ''),
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
        "What is the difference between stocks and bonds?",
      ];
    }
    const stylePrompts = {
      value: ["How do I find undervalued stocks?", "What metrics indicate good value?", "Explain intrinsic value"],
      growth: ["How do I identify growth stocks?", "What is a reasonable P/E for growth?", "Growth vs value?"],
      momentum: ["What is trending in the market?", "How do I spot momentum?", "When to exit momentum trades?"],
      income: ["What is a good dividend yield?", "How do I build passive income?", "Dividend stocks vs bonds?"],
      quality: ["What makes a quality company?", "How do I evaluate fundamentals?", "Quality vs growth?"],
      active: ["How often should I trade?", "What are active trading risks?", "How to time the market?"],
      passive: ["Best index funds to consider?", "How to set and forget?", "Active vs passive performance?"],
      conservative: ["What are safest investments?", "How to protect capital?", "Government bonds vs savings?"],
      moderate: ["What is a balanced allocation?", "How to diversify properly?", "60/40 portfolio relevance?"],
      aggressive: ["High-growth opportunities?", "How much volatility is too much?", "Alternative investments?"],
      esg: ["How to invest sustainably?", "What ESG factors matter?", "Do ESG funds underperform?"],
      largecap: ["Best blue chip stocks?", "Large vs small-cap returns?", "Large company stability?"],
      smallcap: ["How to find small-cap gems?", "Small-cap risks?", "When do small-caps outperform?"],
    };
    return stylePrompts[selectedStyle.id] || stylePrompts.value;
  };

  const formatTime = (date) => {
    if (!date) return "";
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
      messageIdRef.current = 1;
      setMessages([{
        id: 1,
        type: 'ai',
        messageType: 'greeting',
        content: "Hello! I am your AI financial education advisor. I can help you learn about investing, understand your portfolio, and explore different strategies.\n\nTry a quick prompt below, or pick an investing style from the toolbar.",
        timestamp: new Date()
      }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nextMessageId = () => {
    messageIdRef.current += 1;
    return messageIdRef.current;
  };

  const handleStyleSelect = (style) => {
    setSelectedStyle(style);
    setShowStyleSelector(false);
    const styleMessage = {
      id: nextMessageId(),
      type: 'ai',
      messageType: 'style-change',
      timestamp: new Date(),
      style: style,
      content: `I will now respond from a **${style.name}** perspective.\n\n_${style.description}_\n\nAsk me questions with this approach in mind.`,
    };
    setMessages(prev => [...prev, styleMessage]);
  };

  const handleClearStyle = () => {
    setSelectedStyle(null);
    const message = {
      id: nextMessageId(),
      type: 'ai',
      messageType: 'standard',
      content: "Switched back to **general guidance** mode (balanced, educational info).",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  // backend call
  const handleSendMessage = async (content) => {
    const trimmed = (content || '').trim();
    if (!trimmed) return;

    const userMessage = {
      id: nextMessageId(),
      type: 'user',
      content: trimmed,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    const lower = trimmed.toLowerCase();
    const isPortfolioQuestion =
      lower.includes('portfolio') ||
      lower.includes('holdings') ||
      lower.includes('my investments') ||
      lower.includes('my holdings');

    const isEducationQuestion =
      lower.includes('learn') ||
      lower.includes('explain') ||
      lower.includes('what is');

    // Build extra context for the model (optional)
    let extraContext = "";
    if (isPortfolioQuestion && portfolioData) {
      const topHoldings = (portfolioData.holdings || []).slice(0, 5)
        .map(h => `${h.symbol} (${h.name}) value ${h.value}, change ${h.change}`)
        .join("; ");

      extraContext =
        `\n\nPortfolio snapshot (education only):\n` +
        `Total Value: ${portfolioData.totalValue}\n` +
        `Cash: ${portfolioData.cashAvailable}\n` +
        `Risk Profile: ${portfolioData.riskProfile}\n` +
        `Top Holdings: ${topHoldings || "None"}\n`;
    }

    const personalityKey = selectedStyle ? selectedStyle.id : 'default';

    try {
      const data = await aiService.suggest({
        userId,
        personalityKey,
        prompt: trimmed + (extraContext || "")
      });

      const replyText = data?.reply || "No reply returned from backend.";

      const aiResponse = {
        id: nextMessageId(),
        type: 'ai',
        messageType: isPortfolioQuestion ? 'portfolio-reference' : (isEducationQuestion ? 'education' : 'standard'),
        timestamp: new Date(),
        content: replyText,
        portfolioRef: isPortfolioQuestion ? (portfolioData?.holdings?.slice(0, 2) || []) : undefined,
        educationTopic: isEducationQuestion ? trimmed : undefined
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      const errorText = err?.response?.data?.message || err?.message || 'Unknown error';
      setMessages(prev => [...prev, {
        id: nextMessageId(),
        type: 'ai',
        messageType: 'standard',
        timestamp: new Date(),
        content: `AI error: ${errorText}`
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopyMessage = (messageId, content) => {
    navigator.clipboard.writeText(content);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNewChat = () => {
    messageIdRef.current = 1;
    setMessages([{
      id: 1,
      type: 'ai',
      messageType: 'greeting',
      content: "Hello! I am your AI financial education advisor.\n\nAsk me anything, or choose an investing style from the toolbar.",
      timestamp: new Date()
    }]);
    setSelectedStyle(null);
  };

  // PDF Export Function
  const exportChatToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let yPos = 20;

    // Header
    doc.setFillColor(61, 155, 137);
    doc.rect(0, 0, pageWidth, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('InvestED', margin, 18);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('AI Advisor Chat Export', margin, 28);

    const now = new Date();
    doc.setFontSize(9);
    doc.text(
      `Generated: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`,
      pageWidth - margin,
      18,
      { align: 'right' }
    );

    if (selectedStyle) {
      doc.text(`Style: ${selectedStyle.name}`, pageWidth - margin, 28, { align: 'right' });
    }

    yPos = 50;

    // Chat messages
    messages.forEach((message) => {
      // Skip greeting message type for cleaner export
      if (message.messageType === 'greeting') return;

      const isUser = message.type === 'user';
      const label = isUser ? 'You' : 'AI Advisor';
      const time = formatTime(message.timestamp);

      // Check if we need a new page
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 20;
      }

      // Message label and time
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      if (isUser) {
        doc.setTextColor(102, 126, 234);
      } else {
        doc.setTextColor(61, 155, 137);
      }
      doc.text(`${label} - ${time}`, margin, yPos);
      yPos += 6;

      // Message content - strip markdown for cleaner PDF
      const cleanContent = message.content
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/_/g, '')
        .replace(/`/g, '');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);

      const lines = doc.splitTextToSize(cleanContent, maxWidth);
      lines.forEach((line) => {
        if (yPos > pageHeight - 20) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(line, margin, yPos);
        yPos += 5;
      });

      yPos += 8; // Space between messages
    });

    // Footer on last page
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      'InvestED - Educational simulation only - Not real financial advice',
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );

    // Save the PDF
    const filename = `InvestED-Chat-${now.toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
  };

  const Markdown = ({ text }) => (
    <ReactMarkdown
      components={{
        p: ({ children }) => <p style={{ margin: '0 0 0.6rem 0', lineHeight: 1.5 }}>{children}</p>,
        ul: ({ children }) => <ul style={{ margin: '0.2rem 0 0.8rem 1.25rem' }}>{children}</ul>,
        ol: ({ children }) => <ol style={{ margin: '0.2rem 0 0.8rem 1.25rem' }}>{children}</ol>,
        li: ({ children }) => <li style={{ marginBottom: '0.25rem' }}>{children}</li>,
        h1: ({ children }) => <h3 style={{ margin: '0.6rem 0 0.4rem 0' }}>{children}</h3>,
        h2: ({ children }) => <h4 style={{ margin: '0.6rem 0 0.4rem 0' }}>{children}</h4>,
        h3: ({ children }) => <h4 style={{ margin: '0.6rem 0 0.4rem 0' }}>{children}</h4>,
        code: ({ children }) => (
          <code style={{
            padding: '0.1rem 0.35rem',
            borderRadius: '0.35rem',
            background: 'rgba(0,0,0,0.08)',
            fontSize: '0.9em'
          }}>{children}</code>
        )
      }}
    >
      {text}
    </ReactMarkdown>
  );

  const renderMessage = (message) => {
    if (message.messageType === 'greeting') {
      return (
        <div className={styles.greetingBubble}>
          <div className={styles.greetingHeader}>
            <Bot size={32} className={styles.greetingIcon} />
            <div className={styles.greetingTitle}>Welcome to InvestED AI Advisor</div>
          </div>
          <div className={styles.greetingText}>
            <Markdown text={message.content} />
          </div>
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
          <div className={styles.styleChangeText}>
            <Markdown text={message.content} />
          </div>
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
            <Markdown text={message.content} />
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
          <div className={styles.portfolioText}>
            <Markdown text={message.content} />
          </div>
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
        <Markdown text={message.content} />
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

          <button 
            className={styles.toolbarBtn} 
            title="Export chat"
            onClick={exportChatToPDF}
          >
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
                {renderMessage(message)}
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
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
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
          Educational simulation only - Not real financial advice
        </p>
      </div>
    </div>
  );
};

export default AIAdvisorView;
