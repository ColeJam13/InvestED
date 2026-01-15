import { useState, useEffect } from 'react';
import styles from './PortfolioCard.module.css';
import axios from 'axios';

const PortfolioCard = () => {
    const [activeTime, setActiveTime] = useState('1M');
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
                const [summaryRes, histRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/portfolios/user/1/summary'),
                    axios.get('http://localhost:8080/api/portfolios/user/1/performance/historical', {
                        params: { range: activeTime === 'Live' ? '1D' : activeTime === 'All' ? '1Y' : activeTime }
                    })
                ]);
                setPortfolioData(summaryRes.data);
                
                // Transform historical data to chart format
                const transformed = histRes.data.data.map(point => ({
                    timestamp: point.timestamp * 1000, // Convert to milliseconds
                    value: point.value
                }));
                setChartData(transformed);
                
                console.log('Fetched historical data:', histRes.data);
            } catch (error) {
                console.error('Error fetching portfolio data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolioData();
    }, [activeTime]); // Re-fetch when time range changes

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
        const range = max - min || 1;
        
        const points = chartData.map((point, index) => {
            const x = (index / (chartData.length - 1)) * width;
            const y = height - ((point.value - min) / range) * height;
            return `${x},${y}`;
        });
        
        return `M${points.join(' L')}`;
    };

    // Generate area path
    const generateAreaPath = () => {
        const linePath = generateChartPath();
        if (!linePath) return '';
        return `${linePath} L350,150 L0,150 Z`;
    };

    // Generate time labels based on selected range
    const generateTimeLabels = () => {
        if (!chartData || chartData.length === 0) return [];
        
        const step = Math.max(1, Math.floor(chartData.length / 6));
        const labels = [];
        
        for (let i = 0; i < chartData.length; i += step) {
            if (labels.length >= 6) break;
            const date = new Date(chartData[i].timestamp);
            
            let label;
            if (activeTime === '1D' || activeTime === 'Live') {
                label = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            } else if (activeTime === '1W') {
                label = date.toLocaleDateString('en-US', { weekday: 'short' });
            } else {
                label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }
            labels.push(label);
        }
        
        return labels;
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

            {/* Chart with real historical data */}
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
                    <span>{formatCurrency(chartMax)}</span>
                    <span>{formatCurrency(chartMax * 0.75 + chartMin * 0.25)}</span>
                    <span>{formatCurrency((chartMax + chartMin) / 2)}</span>
                    <span>{formatCurrency(chartMax * 0.25 + chartMin * 0.75)}</span>
                    <span>{formatCurrency(chartMin)}</span>
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