import { useState, useEffect, useMemo } from 'react';
import styles from './PortfolioView.module.css';
import axios from 'axios';

const PortfolioView = () => {
    const [positions, setPositions] = useState([]);
    const [portfolios, setPortfolios] = useState([]);
    const [selectedPortfolioId, setSelectedPortfolioId] = useState('all');
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('value');
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [showSellModal, setShowSellModal] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [sellAmount, setSellAmount] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch portfolios and positions
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [portfoliosRes, positionsRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/portfolios/user/1'),
                    axios.get('http://localhost:8080/api/portfolios/user/1/all-positions')
                ]);
                
                setPortfolios(portfoliosRes.data);
                setPositions(positionsRes.data);
            } catch (error) {
                console.error('Error fetching portfolio data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Refresh every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    // Calculate position metrics
    const calculateMetrics = (position) => {
        const marketValue = position.quantity * position.currentPrice;
        const costBasis = position.quantity * position.averageBuyPrice;
        const gainLoss = marketValue - costBasis;
        const gainLossPercent = ((position.currentPrice - position.averageBuyPrice) / position.averageBuyPrice) * 100;
        return { marketValue, costBasis, gainLoss, gainLossPercent };
    };

    // Filter and sort positions
    const filteredPositions = useMemo(() => {
        let result = positions.filter(p => {
            // Portfolio filter
            const matchesPortfolio = selectedPortfolioId === 'all' || p.portfolioId === parseInt(selectedPortfolioId);
            
            // Asset type filter
            const matchesFilter = filter === 'all' || 
                                  (filter === 'stock' && p.assetType === 'STOCK') ||
                                  (filter === 'crypto' && p.assetType === 'CRYPTO');
            
            // Search filter
            const matchesSearch = p.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  p.name.toLowerCase().includes(searchTerm.toLowerCase());
            
            return matchesPortfolio && matchesFilter && matchesSearch;
        });

        result.sort((a, b) => {
            const metricsA = calculateMetrics(a);
            const metricsB = calculateMetrics(b);
            
            let comparison = 0;
            switch (sortBy) {
                case 'symbol':
                    comparison = a.symbol.localeCompare(b.symbol);
                    break;
                case 'value':
                    comparison = metricsA.marketValue - metricsB.marketValue;
                    break;
                case 'gainLoss':
                    comparison = metricsA.gainLoss - metricsB.gainLoss;
                    break;
                case 'gainLossPercent':
                    comparison = metricsA.gainLossPercent - metricsB.gainLossPercent;
                    break;
                case 'shares':
                    comparison = a.quantity - b.quantity;
                    break;
                default:
                    comparison = metricsA.marketValue - metricsB.marketValue;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [positions, selectedPortfolioId, filter, sortBy, sortOrder, searchTerm]);

    // Portfolio totals
    const portfolioTotals = useMemo(() => {
        return filteredPositions.reduce((acc, p) => {
            const metrics = calculateMetrics(p);
            acc.totalValue += metrics.marketValue;
            acc.totalCost += metrics.costBasis;
            acc.totalGainLoss += metrics.gainLoss;
            return acc;
        }, { totalValue: 0, totalCost: 0, totalGainLoss: 0 });
    }, [filteredPositions]);

    const totalGainLossPercent = portfolioTotals.totalCost > 0 
        ? ((portfolioTotals.totalValue - portfolioTotals.totalCost) / portfolioTotals.totalCost) * 100 
        : 0;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const formatPercent = (value) => {
        const sign = value >= 0 ? '+' : '';
        return `${sign}${value.toFixed(2)}%`;
    };

    const formatShares = (shares) => {
        return shares < 1 ? shares.toFixed(4) : shares.toFixed(2);
    };

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('desc');
        }
    };

    const openSellModal = (position) => {
        setSelectedPosition(position);
        setSellAmount('');
        setShowSellModal(true);
        setShowConfirmation(false);
    };

    const handleSellSubmit = (e) => {
        e.preventDefault();
        setShowConfirmation(true);
    };

    const confirmSell = async () => {
        const sharesToSell = parseFloat(sellAmount);
        if (sharesToSell > 0 && sharesToSell <= selectedPosition.quantity) {
            // TODO: Implement sell endpoint
            alert('Sell functionality coming soon!');
            setShowSellModal(false);
            setSelectedPosition(null);
            setSellAmount('');
            setShowConfirmation(false);
        }
    };

    const getSortIcon = (column) => {
        if (sortBy !== column) return '↕️';
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const sectors = [...new Set(positions.map(p => p.assetType))];

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Portfolio</h1>
                </div>
                <div className={styles.loadingState}>Loading portfolio data...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Portfolio</h1>
                    <p className={styles.subtitle}>Manage your investment positions</p>
                </div>
            </div>

            {/* Portfolio Summary */}
            <div className={styles.summaryCards}>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>💼</div>
                    <div className={styles.summaryInfo}>
                        <span className={styles.summaryLabel}>Total Value</span>
                        <span className={styles.summaryValue}>{formatCurrency(portfolioTotals.totalValue)}</span>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>💵</div>
                    <div className={styles.summaryInfo}>
                        <span className={styles.summaryLabel}>Cost Basis</span>
                        <span className={styles.summaryValue}>{formatCurrency(portfolioTotals.totalCost)}</span>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>{portfolioTotals.totalGainLoss >= 0 ? '📈' : '📉'}</div>
                    <div className={styles.summaryInfo}>
                        <span className={styles.summaryLabel}>Total Gain/Loss</span>
                        <span className={`${styles.summaryValue} ${portfolioTotals.totalGainLoss >= 0 ? styles.positive : styles.negative}`}>
                            {formatCurrency(portfolioTotals.totalGainLoss)}
                        </span>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>📊</div>
                    <div className={styles.summaryInfo}>
                        <span className={styles.summaryLabel}>Return</span>
                        <span className={`${styles.summaryValue} ${totalGainLossPercent >= 0 ? styles.positive : styles.negative}`}>
                            {formatPercent(totalGainLossPercent)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className={styles.controls}>
                {/* Portfolio Selector */}
                <div className={styles.portfolioSelector}>
                    <label htmlFor="portfolio-select">Portfolio:</label>
                    <select 
                        id="portfolio-select"
                        value={selectedPortfolioId} 
                        onChange={(e) => setSelectedPortfolioId(e.target.value)}
                        className={styles.portfolioSelect}
                    >
                        <option value="all">All Portfolios</option>
                        {portfolios.map((portfolio) => (
                            <option key={portfolio.id} value={portfolio.id}>
                                {portfolio.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.searchBox}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search positions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                
                <div className={styles.filters}>
                    <button
                        className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === 'stock' ? styles.active : ''}`}
                        onClick={() => setFilter('stock')}
                    >
                        📊 Stocks
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === 'crypto' ? styles.active : ''}`}
                        onClick={() => setFilter('crypto')}
                    >
                        🪙 Crypto
                    </button>
                </div>
            </div>

            {/* Positions Table */}
            {filteredPositions.length > 0 ? (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('symbol')} className={styles.sortable}>
                                    Asset {getSortIcon('symbol')}
                                </th>
                                <th>Portfolio</th>
                                <th onClick={() => handleSort('shares')} className={styles.sortable}>
                                    Shares {getSortIcon('shares')}
                                </th>
                                <th>Avg Cost</th>
                                <th>Price</th>
                                <th onClick={() => handleSort('value')} className={styles.sortable}>
                                    Value {getSortIcon('value')}
                                </th>
                                <th onClick={() => handleSort('gainLoss')} className={styles.sortable}>
                                    Gain/Loss {getSortIcon('gainLoss')}
                                </th>
                                <th onClick={() => handleSort('gainLossPercent')} className={styles.sortable}>
                                    Return {getSortIcon('gainLossPercent')}
                                </th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPositions.map((position) => {
                                const metrics = calculateMetrics(position);
                                const isPositive = metrics.gainLoss >= 0;
                                
                                return (
                                    <tr key={position.id}>
                                        <td>
                                            <div className={styles.assetCell}>
                                                <span className={styles.assetSymbol}>{position.symbol}</span>
                                                <span className={styles.assetName}>{position.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={styles.portfolioBadge}>
                                                {position.portfolioName}
                                            </span>
                                        </td>
                                        <td>{formatShares(position.quantity)}</td>
                                        <td>{formatCurrency(position.averageBuyPrice)}</td>
                                        <td>{formatCurrency(position.currentPrice)}</td>
                                        <td className={styles.valueCell}>{formatCurrency(metrics.marketValue)}</td>
                                        <td>
                                            <span className={`${styles.gainLoss} ${isPositive ? styles.positive : styles.negative}`}>
                                                {isPositive ? '▲' : '▼'} {formatCurrency(Math.abs(metrics.gainLoss))}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`${styles.returnBadge} ${isPositive ? styles.positive : styles.negative}`}>
                                                {formatPercent(metrics.gainLossPercent)}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className={styles.sellBtn}
                                                onClick={() => openSellModal(position)}
                                            >
                                                Sell
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🔭</div>
                    <h3>No positions found</h3>
                    <p>{searchTerm ? 'Try adjusting your search term' : 'Buy your first asset to get started!'}</p>
                </div>
            )}

            {/* Sell Modal - keeping existing modal code */}
            {showSellModal && selectedPosition && (
                <div className={styles.modalOverlay} onClick={() => setShowSellModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        {!showConfirmation ? (
                            <>
                                <div className={styles.modalHeader}>
                                    <h2>Sell {selectedPosition.symbol}</h2>
                                    <button className={styles.closeBtn} onClick={() => setShowSellModal(false)}>×</button>
                                </div>
                                
                                <form onSubmit={handleSellSubmit} className={styles.form}>
                                    <div className={styles.positionInfo}>
                                        <div className={styles.infoRow}>
                                            <span>Current Holdings</span>
                                            <span>{formatShares(selectedPosition.quantity)} shares</span>
                                        </div>
                                        <div className={styles.infoRow}>
                                            <span>Current Price</span>
                                            <span>{formatCurrency(selectedPosition.currentPrice)}</span>
                                        </div>
                                        <div className={styles.infoRow}>
                                            <span>Market Value</span>
                                            <span>{formatCurrency(selectedPosition.quantity * selectedPosition.currentPrice)}</span>
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Shares to Sell</label>
                                        <input
                                            type="number"
                                            value={sellAmount}
                                            onChange={(e) => setSellAmount(e.target.value)}
                                            placeholder="0.00"
                                            step="0.0001"
                                            min="0.0001"
                                            max={selectedPosition.quantity}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className={styles.maxBtn}
                                            onClick={() => setSellAmount(selectedPosition.quantity.toString())}
                                        >
                                            MAX
                                        </button>
                                    </div>

                                    {sellAmount && (
                                        <div className={styles.sellPreview}>
                                            <div className={styles.previewRow}>
                                                <span>Estimated Proceeds</span>
                                                <span className={styles.previewValue}>
                                                    {formatCurrency(parseFloat(sellAmount) * selectedPosition.currentPrice)}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className={styles.formActions}>
                                        <button type="button" className={styles.cancelBtn} onClick={() => setShowSellModal(false)}>
                                            Cancel
                                        </button>
                                        <button type="submit" className={styles.sellSubmitBtn}>
                                            Review Order
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <>
                                <div className={styles.modalHeader}>
                                    <h2>Confirm Sale</h2>
                                    <button className={styles.closeBtn} onClick={() => setShowSellModal(false)}>×</button>
                                </div>

                                <div className={styles.confirmationContent}>
                                    <div className={styles.confirmIcon}>⚠️</div>
                                    <h3>Are you sure?</h3>
                                    <p>You are about to sell:</p>
                                    
                                    <div className={styles.confirmDetails}>
                                        <div className={styles.confirmRow}>
                                            <span>Asset</span>
                                            <span>{selectedPosition.symbol}</span>
                                        </div>
                                        <div className={styles.confirmRow}>
                                            <span>Shares</span>
                                            <span>{formatShares(parseFloat(sellAmount))}</span>
                                        </div>
                                        <div className={styles.confirmRow}>
                                            <span>Price</span>
                                            <span>{formatCurrency(selectedPosition.currentPrice)}</span>
                                        </div>
                                        <div className={`${styles.confirmRow} ${styles.total}`}>
                                            <span>Total Proceeds</span>
                                            <span>{formatCurrency(parseFloat(sellAmount) * selectedPosition.currentPrice)}</span>
                                        </div>
                                    </div>

                                    <div className={styles.formActions}>
                                        <button className={styles.cancelBtn} onClick={() => setShowConfirmation(false)}>
                                            Go Back
                                        </button>
                                        <button className={styles.confirmBtn} onClick={confirmSell}>
                                            Confirm Sale
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PortfolioView;