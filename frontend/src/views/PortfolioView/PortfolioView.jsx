import { useState, useMemo } from 'react';
import styles from './PortfolioView.module.css';

const PortfolioView = () => {
    const [positions, setPositions] = useState([
        { id: 1, symbol: 'AAPL', name: 'Apple Inc.', shares: 15, avgCost: 142.50, currentPrice: 178.25, type: 'stock', sector: 'Technology' },
        { id: 2, symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 8, avgCost: 125.00, currentPrice: 141.80, type: 'stock', sector: 'Technology' },
        { id: 3, symbol: 'BTC', name: 'Bitcoin', shares: 0.5, avgCost: 42000, currentPrice: 67500, type: 'crypto', sector: 'Crypto' },
        { id: 4, symbol: 'MSFT', name: 'Microsoft Corp.', shares: 12, avgCost: 310.00, currentPrice: 378.50, type: 'stock', sector: 'Technology' },
        { id: 5, symbol: 'ETH', name: 'Ethereum', shares: 3.2, avgCost: 2200, currentPrice: 3450, type: 'crypto', sector: 'Crypto' },
        { id: 6, symbol: 'AMZN', name: 'Amazon.com Inc.', shares: 10, avgCost: 145.00, currentPrice: 178.25, type: 'stock', sector: 'Consumer' },
        { id: 7, symbol: 'TSLA', name: 'Tesla Inc.', shares: 20, avgCost: 195.00, currentPrice: 248.50, type: 'stock', sector: 'Automotive' },
        { id: 8, symbol: 'JPM', name: 'JPMorgan Chase', shares: 25, avgCost: 148.00, currentPrice: 195.75, type: 'stock', sector: 'Financial' },
        { id: 9, symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 5, avgCost: 450.00, currentPrice: 875.30, type: 'stock', sector: 'Technology' },
        { id: 10, symbol: 'SOL', name: 'Solana', shares: 50, avgCost: 85.00, currentPrice: 142.60, type: 'crypto', sector: 'Crypto' },
    ]);

    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('value');
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [showSellModal, setShowSellModal] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [sellAmount, setSellAmount] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Calculate position metrics
    const calculateMetrics = (position) => {
        const marketValue = position.shares * position.currentPrice;
        const costBasis = position.shares * position.avgCost;
        const gainLoss = marketValue - costBasis;
        const gainLossPercent = ((position.currentPrice - position.avgCost) / position.avgCost) * 100;
        return { marketValue, costBasis, gainLoss, gainLossPercent };
    };

    // Filter and sort positions
    const filteredPositions = useMemo(() => {
        let result = positions.filter(p => {
            const matchesFilter = filter === 'all' || p.type === filter || p.sector === filter;
            const matchesSearch = p.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  p.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
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
                    comparison = a.shares - b.shares;
                    break;
                default:
                    comparison = metricsA.marketValue - metricsB.marketValue;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [positions, filter, sortBy, sortOrder, searchTerm]);

    // Portfolio totals
    const portfolioTotals = useMemo(() => {
        return positions.reduce((acc, p) => {
            const metrics = calculateMetrics(p);
            acc.totalValue += metrics.marketValue;
            acc.totalCost += metrics.costBasis;
            acc.totalGainLoss += metrics.gainLoss;
            return acc;
        }, { totalValue: 0, totalCost: 0, totalGainLoss: 0 });
    }, [positions]);

    const totalGainLossPercent = ((portfolioTotals.totalValue - portfolioTotals.totalCost) / portfolioTotals.totalCost) * 100;

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

    const confirmSell = () => {
        const sharesToSell = parseFloat(sellAmount);
        if (sharesToSell > 0 && sharesToSell <= selectedPosition.shares) {
            setPositions(prev => prev.map(p => {
                if (p.id === selectedPosition.id) {
                    const newShares = p.shares - sharesToSell;
                    if (newShares <= 0) {
                        return null;
                    }
                    return { ...p, shares: newShares };
                }
                return p;
            }).filter(Boolean));
        }
        setShowSellModal(false);
        setSelectedPosition(null);
        setSellAmount('');
        setShowConfirmation(false);
    };

    const getSortIcon = (column) => {
        if (sortBy !== column) return '↕️';
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const sectors = [...new Set(positions.map(p => p.sector))];

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

            {/* Filters and Search */}
            <div className={styles.controls}>
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
                    {sectors.map(sector => (
                        <button
                            key={sector}
                            className={`${styles.filterBtn} ${filter === sector ? styles.active : ''}`}
                            onClick={() => setFilter(sector)}
                        >
                            {sector}
                        </button>
                    ))}
                </div>
            </div>

            {/* Positions Table */}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('symbol')} className={styles.sortable}>
                                Asset {getSortIcon('symbol')}
                            </th>
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
                                    <td>{formatShares(position.shares)}</td>
                                    <td>{formatCurrency(position.avgCost)}</td>
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

            {filteredPositions.length === 0 && (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📭</div>
                    <h3>No positions found</h3>
                    <p>Try adjusting your filters or search term</p>
                </div>
            )}

            {/* Sell Modal */}
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
                                            <span>{formatShares(selectedPosition.shares)} shares</span>
                                        </div>
                                        <div className={styles.infoRow}>
                                            <span>Current Price</span>
                                            <span>{formatCurrency(selectedPosition.currentPrice)}</span>
                                        </div>
                                        <div className={styles.infoRow}>
                                            <span>Market Value</span>
                                            <span>{formatCurrency(selectedPosition.shares * selectedPosition.currentPrice)}</span>
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
                                            max={selectedPosition.shares}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className={styles.maxBtn}
                                            onClick={() => setSellAmount(selectedPosition.shares.toString())}
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
