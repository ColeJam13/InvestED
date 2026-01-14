import { useState } from 'react';
import { BarChart3, X, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import styles from './StockComparison.module.css';

const StockComparison = ({ assets = [], onClose, onAddAsset }) => {
    const [compareList, setCompareList] = useState(assets.slice(0, 3));

    const metrics = [
        { key: 'price', label: 'Price' },
        { key: 'change24h', label: '24h Change' },
        { key: 'marketCap', label: 'Market Cap' },
        { key: 'volume', label: 'Volume' },
        { key: 'high52w', label: '52W High' },
        { key: 'low52w', label: '52W Low' },
    ];

    const removeFromCompare = (symbol) => {
        setCompareList(prev => prev.filter(a => a.symbol !== symbol));
    };

    const formatValue = (value, key) => {
        if (key === 'change24h') {
            const isPositive = value >= 0;
            return (
                <span className={isPositive ? styles.positive : styles.negative}>
                    {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {isPositive ? '+' : ''}{value}%
                </span>
            );
        }
        return value;
    };

    if (compareList.length === 0) {
        return (
            <div className={styles.emptyState}>
                <BarChart3 size={64} className={styles.emptyIcon} />
                <h3>No assets to compare</h3>
                <p>Add assets to start comparing</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Compare Assets</h2>
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={20} />
                </button>
            </div>

            <div className={styles.compareTable}>
                <div className={styles.tableHeader}>
                    <div className={styles.metricLabel}></div>
                    {compareList.map(asset => (
                        <div key={asset.symbol} className={styles.assetHeader}>
                            <span className={styles.assetSymbol}>{asset.symbol}</span>
                            <span className={styles.assetName}>{asset.name}</span>
                            <button 
                                className={styles.removeBtn}
                                onClick={() => removeFromCompare(asset.symbol)}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                    {compareList.length < 3 && (
                        <div className={styles.addSlot}>
                            <button className={styles.addBtn} onClick={onAddAsset}>
                                <Plus size={20} />
                                Add Asset
                            </button>
                        </div>
                    )}
                </div>

                {metrics.map(metric => (
                    <div key={metric.key} className={styles.tableRow}>
                        <div className={styles.metricLabel}>{metric.label}</div>
                        {compareList.map(asset => (
                            <div key={asset.symbol} className={styles.metricValue}>
                                {formatValue(asset[metric.key], metric.key)}
                            </div>
                        ))}
                        {compareList.length < 3 && <div className={styles.emptyCell}></div>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StockComparison;
