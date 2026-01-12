import { useState } from 'react';
import AssetSearch from '../AssetSearch';
import AssetDetails from '../AssetDetails';
import styles from './MarketsView.module.css';

const MarketsView = () => {
    const [selectedSymbol, setSelectedSymbol] = useState(null);

    const handleAssetSelect = (symbol) => {
        setSelectedSymbol(symbol);
    };

    return (
        <div className={styles.marketsContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Markets</h1>
                <p className={styles.subtitle}>Search and explore stocks & crypto</p>
            </div>

            <div className={styles.content}>
                <div className={styles.searchSection}>
                    <AssetSearch onAssetSelect={handleAssetSelect} />
                </div>

                <div className={styles.detailsSection}>
                    {selectedSymbol ? (
                        <AssetDetails symbol={selectedSymbol} />
                    ) : (
                        <div className={styles.placeholder}>
                            <div className={styles.placeholderIcon}>📈</div>
                            <h3>Select an Asset</h3>
                            <p>Search for a stock or cryptocurrency to view details</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Popular Assets Quick Access */}
            <div className={styles.popularSection}>
                <h3 className={styles.sectionTitle}>Popular Assets</h3>
                <div className={styles.popularGrid}>
                    {['AAPL', 'GOOGL', 'TSLA', 'AMZN', 'BTC/USD', 'ETH/USD'].map((symbol) => (
                        <button
                            key={symbol}
                            className={styles.popularItem}
                            onClick={() => handleAssetSelect(symbol)}
                        >
                            {symbol}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MarketsView;
