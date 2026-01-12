import { useState, useEffect } from 'react';
import ThemeToggle from '../ThemeToggle';
import { marketService } from '../../services/marketService';
import styles from './Header.module.css';

const Header = () => {
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

    // Optional: Fetch real market data
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
                // Keep default data on error
            }
        };

        fetchMarketData();
        // Refresh every 60 seconds
        const interval = setInterval(fetchMarketData, 60000);
        return () => clearInterval(interval);
    }, []);

    // Duplicate the data for seamless marquee loop
    const duplicatedData = [...marketData, ...marketData];

    return (
        <header className={styles.header}>
            <div className={styles.headerLeft}>
                <div className={styles.logo}>InvestED</div>
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
                <div className={styles.avatar}>JM</div>
            </div>
        </header>
    );
};

export default Header;
