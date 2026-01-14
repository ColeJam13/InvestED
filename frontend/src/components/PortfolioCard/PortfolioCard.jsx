import { useState, useEffect } from 'react';
import styles from './PortfolioCard.module.css';
import axios from 'axios';

const PortfolioCard = () => {
    const [activeTime, setActiveTime] = useState('1D');
    const [activeFilter, setActiveFilter] = useState('all');
    const [portfolioData, setPortfolioData] = useState(null);
    const [chartData, setChartData] = useState([]);
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
                const [summaryRes, chartRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/portfolios/user/1/summary'),
                    axios.get('http://localhost:8080/api/portfolio-snapshots/user/1/chart-data')
                ]);
                setPortfolioData(summaryRes.data);
                setChartData(chartRes.data);
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

    // Generate SVG path from chart data
    const generateChartPath = () => {
        if (!chartData || chartData.length === 0) return '';
        
        const width = 350;
        const height = 150;
        const values = chartData.map(d => d.value);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = max - min || 1; // Avoid division by zero
        
        const points = chartData.map((point, index) => {
            const x = (index / (chartData.length - 1)) * width;
            const y = height - ((point.value - min) / range) * height;
            return `${x},${y}`;
        });
        
        return `M${points.join(' L')}`;
    };

    // Generate area path (same as line but closed at bottom)
    const generateAreaPath = () => {
        const linePath = generateChartPath();
        if (!linePath) return '';
        return `${linePath} L350,150 L0,150 Z`;
    };

    // Generate time labels from chart data
    const generateTimeLabels = () => {
        if (!chartData || chartData.length === 0) return [];
        
        const step = Math.floor(chartData.length / 7); // Show 7 labels
        return chartData
            .filter((_, index) => index % step === 0)
            .slice(0, 6)
            .map(point => {
                const date = new Date(point.timestamp);
                return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
            });
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
    const chartMax = chartData.length > 0 ? Math.max(...chartData.map(d => d.value)) : portfolioData.totalValue;
    const chartMin = chartData.length > 0 ? Math.min(...chartData.map(d => d.value)) : portfolioData.totalValue;

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

            {/* Chart with real data */}
            <div className={styles.chartContainer}>
                <svg className={styles.chartSvg} viewBox="0 0 350 150" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="var(--accent-green)" stopOpacity="0.3"/>
                            <stop offset="100%" stopColor="var(--accent-green)" stopOpacity="0"/>
                        </linearGradient>
                    </defs>
                    {chartData.length > 0 && (
                        <>
                            <path 
                                className={styles.chartArea} 
                                d={generateAreaPath()}
                                fill="url(#chartGradient)"
                            />
                            <path 
                                className={styles.chartLine} 
                                d={generateChartPath()} 
                                fill="none" 
                                strokeWidth="2.5"
                            />
                        </>
                    )}
                </svg>
                
                {/* Y-Axis Labels */}
                <div className={styles.yAxisLabels}>
                    <span>{formatCurrency(chartMax * 1.01)}</span>
                    <span>{formatCurrency(chartMax * 1.005)}</span>
                    <span>{formatCurrency((chartMax + chartMin) / 2)}</span>
                    <span>{formatCurrency(chartMin * 0.995)}</span>
                    <span>{formatCurrency(chartMin * 0.99)}</span>
                </div>
            </div>

            {/* X-Axis Labels */}
            <div className={styles.xAxisLabels}>
                {generateTimeLabels().map((label, index) => (
                    <span key={index}>{label}</span>
                ))}
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