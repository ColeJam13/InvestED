import styles from './HoldingsList.module.css';

const HoldingsList = () => {
    const holdings = [
        {
            symbol: 'AAPL',
            name: 'Apple Inc.',
            shares: '10 shares',
            value: '$1,850.00',
            change: '+$42.30 (+2.3%)',
            positive: true,
            color: '#FF6B6B', // Coral/pink
        },
        {
            symbol: 'BTC',
            name: 'Bitcoin',
            shares: '0.5 coins',
            value: '$34,500.00',
            change: '-$420.00 (-1.2%)',
            positive: false,
            color: '#F7931A', // Bitcoin orange
        },
        {
            symbol: 'TSLA',
            name: 'Tesla Inc.',
            shares: '5 shares',
            value: '$1,250.00',
            change: '+$67.50 (+5.7%)',
            positive: true,
            color: '#E31937', // Tesla red
        },
        {
            symbol: 'ETH',
            name: 'Ethereum',
            shares: '2.5 coins',
            value: '$6,125.00',
            change: '+$89.50 (+1.5%)',
            positive: true,
            color: '#627EEA', // Ethereum purple
        },
    ];

    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <div className={styles.sectionTitle}>
                    <span className={styles.icon}>📊</span>
                    Your Holdings (5)
                    <span className={styles.infoIcon}>ⓘ</span>
                </div>
                <a href="#" className={styles.viewAll}>View All →</a>
            </div>
            
            <div className={styles.holdingsCard}>
                <div className={styles.holdingsList}>
                    {holdings.map((holding, index) => (
                        <div key={index} className={styles.holdingItem}>
                            <div className={styles.holdingLeft}>
                                <div 
                                    className={styles.holdingIcon}
                                    style={{ backgroundColor: holding.color }}
                                >
                                    {holding.symbol}
                                </div>
                                <div className={styles.holdingInfo}>
                                    <span className={styles.holdingName}>{holding.name}</span>
                                    <span className={styles.holdingShares}>{holding.shares}</span>
                                </div>
                            </div>
                            <div className={styles.holdingRight}>
                                <div className={styles.holdingValue}>{holding.value}</div>
                                <div className={`${styles.holdingChange} ${holding.positive ? styles.positive : styles.negative}`}>
                                    {holding.change}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HoldingsList;
