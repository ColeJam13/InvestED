import { useState, useEffect } from 'react';
import styles from './PortfolioCard.module.css';
import axios from 'axios';

const PortfolioCard = () => {
    const [activeTime, setActiveTime] = useState('1D');
    const [activeFilter, setActiveFilter] = useState('all');
    const [portfolioData, setPortfolioData] = useState(null);
    const [loading, setLoading] = useState(true);

    const timeFilters = ['Live', '1D', '1W', '1M', '3M', '1Y', 'All'];
    const assetFilters = [
        { id: 'all', label: 'All Assets' },
        { id: 'stocks', label: 'Stocks Only' },
        { id: 'crypto', label: 'Crypto Only' },
    ];

    useEffect(() => {
        const fetchPortfolioData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8080/api/portfolios/user/1/summary');
                setPortfolioData(response.data);
            } catch (error) {
                console.error('Error fetching portfolio data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolioData();
        // Refresh every 30 seconds
        const interval = setInterval(fetchPortfolioData, 30000);
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

    const formatPercent = (value) => {
        if (!value) return '+0.00%';
        const sign = value >= 0 ? '+' : '';
        return `${sign}${parseFloat(value).toFixed(2)}%`;
    };

    if (loading) {
        return (
            <div className={styles.card}>
                <div className={styles.portfolioLabel}>Total Portfolio Value</div>
                <div className={styles.portfolioValue}>Loading...</div>
            </div>
        );
    }

    if (!portfolioData) {
        return (
            <div className={styles.card}>
                <div className={styles.portfolioLabel}>Total Portfolio Value</div>
                <div className={styles.portfolioValue}>Error loading data</div>
            </div>
        );
    }

    const isPositive = portfolioData.totalGainLoss >= 0;

    return (
        <div className={styles.card}>
            <div className={styles.portfolioLabel}>Total Portfolio Value</div>
            <div className={styles.portfolioValue}>{formatCurrency(portfolioData.totalValue)}</div>
            
            <div className={styles.portfolioMeta}>
                <span className={`${styles.portfolioChange} ${isPositive ? styles.positive : styles.negative}`}>
                    {isPositive ? '+' : ''}{formatCurrency(portfolioData.totalGainLoss)} ({formatPercent(portfolioData.totalGainLossPercent)})
                </span>
                <span className={styles.cashBadge}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                        <circle cx="12" cy="12" r="2"></circle>
                    </svg>
                    Cash Available: {formatCurrency(portfolioData.totalCash)}
                </span>
            </div>

            {/* Chart - placeholder for now */}
            <div className={styles.chartContainer}>
                <svg className={styles.chartSvg} viewBox="0 0 400 150" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="var(--accent-green)" stopOpacity="0.3"/>
                            <stop offset="100%" stopColor="var(--accent-green)" stopOpacity="0"/>
                        </linearGradient>
                    </defs>
                    <path 
                        className={styles.chartArea} 
                        d="M0,120 Q50,115 80,110 T150,100 T200,95 T250,85 T300,60 T350,40 T400,20 L400,150 L0,150 Z"
                        fill="url(#chartGradient)"
                    />
                    <path 
                        className={styles.chartLine} 
                        d="M0,120 Q50,115 80,110 T150,100 T200,95 T250,85 T300,60 T350,40 T400,20" 
                        fill="none" 
                        strokeWidth="2.5"
                    />
                </svg>
                
                {/* Y-Axis Labels */}
                <div className={styles.yAxisLabels}>
                    <span>{formatCurrency(portfolioData.totalValue * 1.02)}</span>
                    <span>{formatCurrency(portfolioData.totalValue * 1.01)}</span>
                    <span>{formatCurrency(portfolioData.totalValue)}</span>
                    <span>{formatCurrency(portfolioData.totalValue * 0.99)}</span>
                    <span>{formatCurrency(portfolioData.totalValue * 0.98)}</span>
                </div>
            </div>

            {/* X-Axis Labels */}
            <div className={styles.xAxisLabels}>
                <span>9:30</span>
                <span>10:30</span>
                <span>11:30</span>
                <span>12:30</span>
                <span>13:30</span>
                <span>14:30</span>
                <span>15:30</span>
            </div>

            {/* Time Filters */}
            <div className={styles.timeFilters}>
                {timeFilters.map((time) => (
                    <button
                        key={time}
                        className={`${styles.timeBtn} ${activeTime === time ? styles.active : ''}`}
                        onClick={() => setActiveTime(time)}
                    >
                        {time}
                    </button>
                ))}
            </div>

            {/* Asset Filters */}
            <div className={styles.assetFilters}>
                {assetFilters.map((filter) => (
                    <button
                        key={filter.id}
                        className={`${styles.filterBtn} ${activeFilter === filter.id ? styles.active : ''}`}
                        onClick={() => setActiveFilter(filter.id)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PortfolioCard;