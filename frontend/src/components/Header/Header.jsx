import ThemeToggle from '../ThemeToggle';
import styles from './Header.module.css';

const Header = () => {
    const marketData = [
        { symbol: 'BTC', price: '$69,420', change: '+1.9%', positive: true },
        { symbol: 'AAPL', price: '$185.34', change: '+1.2%', positive: true },
        { symbol: 'META', price: '$512.88', change: '-0.5%', positive: false },
        { symbol: 'NVDA', price: '$875.50', change: '+2.1%', positive: true },
    ];

    return (
        <header className={styles.header}>
            <div className={styles.headerLeft}>
                <div className={styles.logo}>InvestED</div>
                <div className={styles.marketTicker}>
                    <span className={styles.tickerLabel}>MARKET MOVERS</span>
                    {marketData.map((item, index) => (
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
            <div className={styles.headerRight}>
                <span className={styles.welcomeText}>Welcome back, Jordan!</span>
                <ThemeToggle />
                <div className={styles.avatar}>JM</div>
            </div>
        </header>
    );
};

export default Header;
