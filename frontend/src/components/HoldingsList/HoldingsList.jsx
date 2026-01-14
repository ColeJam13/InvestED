import styles from './HoldingsList.module.css';

const HoldingsList = ({ onNavigate }) => {
    const holdings = [
        { symbol: 'BTC', name: 'Bitcoin', value: '$34,500.00', change: '+2.5%', positive: true },
        { symbol: 'ETH', name: 'Ethereum', value: '$6,125.00', change: '+1.8%', positive: true },
        { symbol: 'AAPL', name: 'Apple Inc.', value: '$1,850.00', change: '-0.5%', positive: false },
    ];

    const handleViewAll = (e) => {
        e.preventDefault();
        if (onNavigate) {
            onNavigate('portfolio');
        }
    };

    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <div className={styles.sectionTitle}>
                    <span className={styles.icon}>💼</span>
                    Top Holdings
                </div>
                <a href="#" className={styles.viewAll} onClick={handleViewAll}>View All →</a>
            </div>
            
            <div className={styles.holdingsList}>
                {holdings.map((holding, index) => (
                    <div key={index} className={styles.holdingItem}>
                        <div className={styles.holdingInfo}>
                            <span className={styles.holdingSymbol}>{holding.symbol}</span>
                            <span className={styles.holdingName}>{holding.name}</span>
                        </div>
                        <div className={styles.holdingValue}>
                            <span className={styles.value}>{holding.value}</span>
                            <span className={`${styles.change} ${holding.positive ? styles.positive : styles.negative}`}>
                                {holding.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HoldingsList;
