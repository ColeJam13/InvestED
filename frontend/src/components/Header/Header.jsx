import { useState, useEffect } from 'react';
import ThemeToggle from '../ThemeToggle';
import { marketService } from '../../services/marketService';
import styles from './Header.module.css';

// Custom graduation cap with dollar sign tassel
const GradCapDollar = ({ size = 24 }) => (
    <svg 
        width={size} 
        height={size * 0.75} 
        viewBox="0 0 40 28" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        {/* Cap top - centered in wider viewBox */}
        <polygon points="18 1 4 9 18 17 32 9 18 1" />
        {/* Cap base */}
        <path d="M8 11v7c0 2.5 4 5 10 5s10-2.5 10-5v-7" />
        {/* Tassel string */}
        <line x1="32" y1="9" x2="32" y2="14" />
        {/* Dollar sign as tassel end */}
        <text 
            x="32" 
            y="22" 
            fontSize="11" 
            fontWeight="bold" 
            textAnchor="middle" 
            fill="currentColor" 
            stroke="none"
        >
            $
        </text>
    </svg>
);

const Header = ({ onNavigate }) => {
    const [marketData, setMarketData] = useState([
        { symbol: 'BTC', price: '$69,420', change: '+1.9%', positive: true },
        { symbol: 'AAPL', price: '$185.34', change: '+1.2%', positive: true },
        { symbol: 'META', price: '$512.88', change: '-0.5%', positive: false },
        { symbol: 'NVDA', price: '$875.50', change: '+2.1%', positive: true },
        { symbol: 'TSLA', price: '$245.67', change: '+2.8%', positive: true },
        { symbol: 'GOOGL', price: '$142.65', change: '+0.8%', positive: true },
        { symbol: 'AMZN', price: '$178.25', change: '-0.3%', positive: false },
        { symbol: 'ETH', price: '$2,450', change: '+3.2%', positive: true },
    ]);

    useEffect(() => {
        const fetchMarketData = async () => {
            try {
                const symbols = ['AAPL', 'GOOGL', 'TSLA', 'META', 'NVDA', 'AMZN'];
                const promises = symbols.map(symbol => marketService.getAssetQuote(symbol));
                const results = await Promise.all(promises);
                const formattedData = results
                    .filter(quote => quote && quote.close)
                    .map(quote => ({
                        symbol: quote.symbol,
                        price: `$${parseFloat(quote.close).toFixed(2)}`,
                        change: `${parseFloat(quote.percent_change) >= 0 ? '+' : ''}${parseFloat(quote.percent_change).toFixed(2)}%`,
                        positive: parseFloat(quote.percent_change) >= 0
                    }));
                if (formattedData.length > 0) {
                    setMarketData(formattedData);
                }
            } catch (error) {
                console.error('Failed to fetch market data:', error);
            }
        };
        fetchMarketData();
        const interval = setInterval(fetchMarketData, 60000);
        return () => clearInterval(interval);
    }, []);

    const duplicatedData = [...marketData, ...marketData];

    const handleAvatarClick = () => {
        if (onNavigate) {
            onNavigate('profile');
        }
    };

    const handleLogoClick = () => {
        if (onNavigate) {
            onNavigate('home');
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerLeft}>
                <button className={styles.logoButton} onClick={handleLogoClick}>
                    <div className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <GradCapDollar size={44} />
                        </div>
                        <div className={styles.logoText}>
                            <span className={styles.logoInvest}>INVEST</span>
                            <span className={styles.logoEd}>ED</span>
                        </div>
                    </div>
                </button>
                <div className={styles.tickerWrapper}>
                    <span className={styles.tickerLabel}>MARKET MOVERS</span>
                    <div className={styles.marqueeContainer}>
                        <div className={styles.marquee}>
                            {duplicatedData.map((item, index) => (
                                <div
                                    key={index}
                                    className={`${styles.tickerItem} ${item.positive ? styles.positive : styles.negative}`}
                                >
                                    <span className={styles.tickerSymbol}>{item.symbol}</span>
                                    <span className={styles.tickerPrice}>{item.price}</span>
                                    <span className={styles.tickerChange}>{item.change}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.headerRight}>
                <span className={styles.welcomeText}>Welcome back, Jordan!</span>
                <ThemeToggle />
                <button className={styles.avatarButton} onClick={handleAvatarClick}>
                    <div className={styles.avatar}>JM</div>
                </button>
            </div>
        </header>
    );
};

export default Header;
