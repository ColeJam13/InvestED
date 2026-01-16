import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Info } from 'lucide-react';
import styles from './HoldingsList.module.css';
import axios from 'axios';

const HoldingsList = () => {
    const [holdings, setHoldings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHoldings = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8080/api/portfolios/user/1/all-positions');
                setHoldings(response.data);
            } catch (error) {
                console.error('Error fetching holdings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHoldings();
        // Refresh every 30 seconds
        const interval = setInterval(fetchHoldings, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatCurrency = (amount) => {
        if (!amount) return '$0.00';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const formatShares = (shares) => {
        return shares < 1 ? parseFloat(shares).toFixed(4) : parseFloat(shares).toFixed(2);
    };

    const calculateGainLoss = (quantity, avgPrice, currentPrice) => {
        const costBasis = quantity * avgPrice;
        const marketValue = quantity * currentPrice;
        const gainLoss = marketValue - costBasis;
        const gainLossPercent = ((currentPrice - avgPrice) / avgPrice) * 100;
        return { gainLoss, gainLossPercent };
    };

    const getAssetColor = (symbol) => {
            // Strip CRYPTO: prefix for color matching
            const cleanSymbol = symbol.replace('CRYPTO:', '');
            
            const colors = {
                'AAPL': '#FF6B6B',
                'BTC': '#F7931A',
                'TSLA': '#E31937',
                'ETH': '#627EEA',
                'GOOGL': '#4285F4',
                'AMZN': '#FF9900',
                'MSFT': '#00A4EF',
                'META': '#0668E1',
                'NVDA': '#76B900',
            };
            return colors[cleanSymbol] || '#80C4B7';
        };

    if (loading) {
        return (
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionTitle}>
                        <BarChart3 size={20} className={styles.icon} />
                        Your Holdings
                    </div>
                </div>
                <div className={styles.holdingsCard}>
                    <div className={styles.loadingState}>Loading holdings...</div>
                </div>
            </div>
        );
    }

    if (holdings.length === 0) {
        return (
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionTitle}>
                        <BarChart3 size={20} className={styles.icon} />
                        Your Holdings (0)
                    </div>
                </div>
                <div className={styles.holdingsCard}>
                    <div className={styles.emptyState}>
                        <TrendingUp size={48} className={styles.emptyIcon} />
                        <p>No holdings yet</p>
                        <span className={styles.emptyHint}>Buy your first asset to get started!</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <div className={styles.sectionTitle}>
                    <BarChart3 size={20} className={styles.icon} />
                    Your Holdings ({holdings.length})
                    <Info size={16} className={styles.infoIcon} />
                </div>
                <a href="#" className={styles.viewAll}>View All →</a>
            </div>

            <div className={styles.holdingsCard}>
                <div className={styles.holdingsList}>
                    {holdings.map((holding) => {
                        const { gainLoss, gainLossPercent } = calculateGainLoss(
                            holding.quantity,
                            holding.averageBuyPrice,
                            holding.currentPrice
                        );
                        const marketValue = holding.quantity * holding.currentPrice;
                        const isPositive = gainLoss >= 0;

                        return (
                            <div key={holding.id} className={styles.holdingItem}>
                                <div className={styles.holdingLeft}>
                                    <div
                                        className={styles.holdingIcon}
                                        style={{ backgroundColor: getAssetColor(holding.symbol) }}
                                    >
                                        {holding.symbol.replace('CRYPTO:', '')}
                                    </div>
                                    <div className={styles.holdingInfo}>
                                        <span className={styles.holdingName}>{holding.name.replace('CRYPTO:', '')}</span>
                                        <span className={styles.holdingShares}>
                                            {formatShares(holding.quantity)} shares • {holding.portfolioName}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.holdingRight}>
                                    <div className={styles.holdingValue}>{formatCurrency(marketValue)}</div>
                                    <div className={`${styles.holdingChange} ${isPositive ? styles.positive : styles.negative}`}>
                                        {isPositive ? '+' : ''}{formatCurrency(Math.abs(gainLoss))} ({isPositive ? '+' : ''}{gainLossPercent.toFixed(2)}%)
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default HoldingsList;
