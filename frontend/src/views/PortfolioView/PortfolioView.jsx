import { useState, useEffect, useMemo, useCallback } from 'react';
import { Briefcase, DollarSign, TrendingUp, TrendingDown, BarChart3, Search, AlertTriangle, Inbox, Download } from 'lucide-react';
import styles from './PortfolioView.module.css';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    const [exportingPDF, setExportingPDF] = useState(false);

    const fetchData = useCallback(async () => {
        console.log('Fetching portfolio data...', new Date().toLocaleTimeString());
        setLoading(true);
        try {
            const [portfoliosRes, positionsRes] = await Promise.all([
                axios.get('http://localhost:8080/api/portfolios/user/1'),
                axios.get('http://localhost:8080/api/portfolios/user/1/all-positions')
            ]);

            setPortfolios(portfoliosRes.data);
            setPositions(positionsRes.data);
            console.log('Portfolio data updated', positionsRes.data);
        } catch (error) {
            console.error('Error fetching portfolio data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const calculateMetrics = (position) => {
        const marketValue = position.quantity * position.currentPrice;
        const costBasis = position.quantity * position.averageBuyPrice;
        const gainLoss = marketValue - costBasis;
        const gainLossPercent = position.averageBuyPrice > 0
            ? ((position.currentPrice - position.averageBuyPrice) / position.averageBuyPrice) * 100
            : 0;
        return { marketValue, costBasis, gainLoss, gainLossPercent };
    };

    const filteredPositions = useMemo(() => {
        let result = positions.filter(p => {
            const matchesPortfolio = selectedPortfolioId === 'all' || p.portfolioId === parseInt(selectedPortfolioId);
            const matchesFilter = filter === 'all' || p.assetType?.toLowerCase() === filter;
            const matchesSearch = p.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  p.name?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesPortfolio && matchesFilter && matchesSearch;
        });

        result.sort((a, b) => {
            const metricsA = calculateMetrics(a);
            const metricsB = calculateMetrics(b);

            let comparison = 0;
            switch (sortBy) {
                case 'symbol':
                    comparison = (a.symbol || '').localeCompare(b.symbol || '');
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

    const portfolioTotals = useMemo(() => {
        const positionsToSum = selectedPortfolioId === 'all'
            ? positions
            : positions.filter(p => p.portfolioId === parseInt(selectedPortfolioId));

        return positionsToSum.reduce((acc, p) => {
            const metrics = calculateMetrics(p);
            acc.totalValue += metrics.marketValue;
            acc.totalCost += metrics.costBasis;
            acc.totalGainLoss += metrics.gainLoss;
            return acc;
        }, { totalValue: 0, totalCost: 0, totalGainLoss: 0 });
    }, [positions, selectedPortfolioId]);

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
        return sign + value.toFixed(2) + '%';
    };

    const formatShares = (shares) => {
        return shares < 1 ? shares.toFixed(4) : shares.toFixed(2);
    };

    const exportToPDF = async () => {
        setExportingPDF(true);

        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const now = new Date();
            const margin = 15;
            const contentWidth = pageWidth - (margin * 2);

            // InvestED Dark Mode Colors
            const colors = {
                darkBg: [26, 26, 46],
                cardBg: [35, 39, 56],
                brandGreen: [61, 155, 137],
                brandGreenLight: [128, 196, 183],
                accentGreen: [72, 187, 120],
                accentRed: [245, 101, 101],
                textWhite: [255, 255, 255],
                textGray: [156, 163, 175],
                textLight: [229, 231, 235],
            };

            let yPos = 0;

            // ===== HEADER =====
            doc.setFillColor(colors.darkBg[0], colors.darkBg[1], colors.darkBg[2]);
            doc.rect(0, 0, pageWidth, 35, 'F');

            doc.setFillColor(colors.brandGreen[0], colors.brandGreen[1], colors.brandGreen[2]);
            doc.rect(0, 35, pageWidth, 2, 'F');

            // Logo text - INVESTED as one word
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(colors.textGray[0], colors.textGray[1], colors.textGray[2]);
            doc.text('INVEST', margin, 22);
            doc.setTextColor(colors.brandGreen[0], colors.brandGreen[1], colors.brandGreen[2]);
            doc.text('ED', margin + 28, 22);

            // Right side info
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(colors.textWhite[0], colors.textWhite[1], colors.textWhite[2]);
            doc.text('Portfolio Statement', pageWidth - margin, 16, { align: 'right' });

            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(colors.textGray[0], colors.textGray[1], colors.textGray[2]);
            doc.text(now.toLocaleDateString('en-US', { 
                month: 'long', day: 'numeric', year: 'numeric'
            }), pageWidth - margin, 24, { align: 'right' });

            const portfolioName = selectedPortfolioId === 'all'
                ? 'All Portfolios'
                : portfolios.find(p => p.id === parseInt(selectedPortfolioId))?.name || 'Portfolio';
            doc.setTextColor(colors.brandGreenLight[0], colors.brandGreenLight[1], colors.brandGreenLight[2]);
            doc.text(portfolioName, pageWidth - margin, 31, { align: 'right' });

            yPos = 47;

            // ===== ACCOUNT SUMMARY =====
            doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
            doc.roundedRect(margin, yPos, contentWidth, 50, 3, 3, 'F');

            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(colors.brandGreen[0], colors.brandGreen[1], colors.brandGreen[2]);
            doc.text('ACCOUNT SUMMARY', margin + 8, yPos + 12);

            const totalCash = portfolios.length > 0 
                ? (selectedPortfolioId === 'all'
                    ? portfolios.reduce((sum, p) => sum + (p.cashBalance || 0), 0)
                    : portfolios.find(p => p.id === parseInt(selectedPortfolioId))?.cashBalance || 0)
                : 0;

            const colWidth = (contentWidth - 16) / 3;
            const summaryY = yPos + 22;

            const summaryItems = [
                { label: 'Total Value', value: formatCurrency(portfolioTotals.totalValue + totalCash), color: colors.textWhite },
                { label: 'Cash Balance', value: formatCurrency(totalCash), color: colors.textWhite },
                { label: 'Securities Value', value: formatCurrency(portfolioTotals.totalValue), color: colors.textWhite },
                { label: 'Cost Basis', value: formatCurrency(portfolioTotals.totalCost), color: colors.textWhite },
                { label: 'Total Gain/Loss', value: formatCurrency(portfolioTotals.totalGainLoss), color: portfolioTotals.totalGainLoss >= 0 ? colors.accentGreen : colors.accentRed },
                { label: 'Return', value: formatPercent(totalGainLossPercent), color: totalGainLossPercent >= 0 ? colors.accentGreen : colors.accentRed },
            ];

            summaryItems.forEach((item, i) => {
                const col = i % 3;
                const row = Math.floor(i / 3);
                const x = margin + 8 + (col * colWidth);
                const y = summaryY + (row * 16);

                doc.setFontSize(8);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(colors.textGray[0], colors.textGray[1], colors.textGray[2]);
                doc.text(item.label, x, y);

                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(item.color[0], item.color[1], item.color[2]);
                doc.text(item.value, x, y + 8);
            });

            yPos += 58;

            // ===== HOLDINGS =====
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(colors.darkBg[0], colors.darkBg[1], colors.darkBg[2]);
            doc.text('HOLDINGS', margin, yPos);

            yPos += 5;

            if (filteredPositions.length > 0) {
                const holdingsData = filteredPositions.map(position => {
                    const metrics = calculateMetrics(position);
                    return [
                            position.symbol.replace('CRYPTO:', ''),
                            (position.name || '').replace('CRYPTO:', ''),
                        formatShares(position.quantity),
                        formatCurrency(position.currentPrice),
                        formatCurrency(metrics.marketValue),
                        formatCurrency(metrics.gainLoss),
                        formatPercent(metrics.gainLossPercent)
                    ];
                });

                autoTable(doc, {
                    startY: yPos,
                    head: [['Symbol', 'Description', 'Shares', 'Price', 'Value', 'Gain/Loss', 'Return']],
                    body: holdingsData,
                    theme: 'plain',
                    styles: {
                        fontSize: 8,
                        cellPadding: 3,
                    },
                    headStyles: {
                        fillColor: colors.darkBg,
                        textColor: colors.textWhite,
                        fontStyle: 'bold',
                        fontSize: 8,
                    },
                    bodyStyles: {
                        textColor: [51, 51, 51],
                    },
                    alternateRowStyles: {
                        fillColor: [245, 247, 250],
                    },
                    columnStyles: {
                        0: { fontStyle: 'bold', cellWidth: contentWidth * 0.12 },
                        1: { cellWidth: contentWidth * 0.22 },
                        2: { halign: 'right', cellWidth: contentWidth * 0.12 },
                        3: { halign: 'right', cellWidth: contentWidth * 0.14 },
                        4: { halign: 'right', cellWidth: contentWidth * 0.14 },
                        5: { halign: 'right', cellWidth: contentWidth * 0.13 },
                        6: { halign: 'right', cellWidth: contentWidth * 0.13 },
                    },
                    tableWidth: contentWidth,
                    margin: { left: margin, right: margin },
                    didParseCell: function(data) {
                        if (data.section === 'body') {
                            if (data.column.index === 0) {
                                data.cell.styles.textColor = colors.brandGreen;
                            }
                            if (data.column.index === 5 || data.column.index === 6) {
                                const value = data.cell.raw;
                                if (value && value.includes('-')) {
                                    data.cell.styles.textColor = colors.accentRed;
                                } else {
                                    data.cell.styles.textColor = colors.accentGreen;
                                }
                            }
                        }
                    }
                });

                yPos = doc.lastAutoTable.finalY + 10;
            }

            // ===== ASSET ALLOCATION =====
            if (filteredPositions.length > 0) {
                // Check if we need a new page
                if (yPos > pageHeight - 80) {
                    doc.addPage();
                    yPos = 20;
                }

                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(colors.darkBg[0], colors.darkBg[1], colors.darkBg[2]);
                doc.text('ASSET ALLOCATION', margin, yPos);

                yPos += 5;

                const allocation = filteredPositions.reduce((acc, position) => {
                    const type = position.assetType || 'Other';
                    const metrics = calculateMetrics(position);
                    if (!acc[type]) acc[type] = { value: 0, count: 0 };
                    acc[type].value += metrics.marketValue;
                    acc[type].count += 1;
                    return acc;
                }, {});

                const allocationData = Object.entries(allocation).map(([type, data]) => [
                    type,
                    data.count.toString(),
                    formatCurrency(data.value),
                    ((data.value / portfolioTotals.totalValue) * 100).toFixed(1) + '%'
                ]);

                autoTable(doc, {
                    startY: yPos,
                    head: [['Asset Type', 'Holdings', 'Value', 'Allocation']],
                    body: allocationData,
                    theme: 'plain',
                    styles: {
                        fontSize: 9,
                        cellPadding: 3,
                    },
                    headStyles: {
                        fillColor: colors.darkBg,
                        textColor: colors.textWhite,
                        fontStyle: 'bold',
                    },
                    bodyStyles: {
                        textColor: [51, 51, 51],
                    },
                    alternateRowStyles: {
                        fillColor: [245, 247, 250],
                    },
                    columnStyles: {
                        0: { fontStyle: 'bold', cellWidth: contentWidth * 0.25 },
                        1: { halign: 'center', cellWidth: contentWidth * 0.25 },
                        2: { halign: 'right', cellWidth: contentWidth * 0.25 },
                        3: { halign: 'right', cellWidth: contentWidth * 0.25, fontStyle: 'bold', textColor: colors.brandGreen },
                    },
                    tableWidth: contentWidth,
                    margin: { left: margin, right: margin },
                });

                yPos = doc.lastAutoTable.finalY + 10;
            }

            // ===== TRANSACTION HISTORY =====
            try {
                const txUrl = selectedPortfolioId === 'all'
                    ? 'http://localhost:8080/api/transactions/user/1'
                    : 'http://localhost:8080/api/transactions/portfolio/' + selectedPortfolioId;

                const txRes = await axios.get(txUrl);
                const transactions = txRes.data;

                if (transactions && transactions.length > 0) {
                    // Check if we need a new page - only if not enough space for header + a few rows
                    if (yPos > pageHeight - 60) {
                        doc.addPage();
                        yPos = 20;
                    }

                    doc.setFontSize(11);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(colors.darkBg[0], colors.darkBg[1], colors.darkBg[2]);
                    doc.text('TRANSACTION HISTORY', margin, yPos);

                    yPos += 5;

                    const txData = transactions.slice(0, 20).map(t => [
                        new Date(t.transactionDate).toLocaleDateString(),
                        t.transactionType,
                        t.asset?.symbol || '-',
                        parseFloat(t.quantity).toFixed(4),
                        formatCurrency(parseFloat(t.priceAtTransaction)),
                        formatCurrency(parseFloat(t.totalAmount))
                    ]);

                    autoTable(doc, {
                        startY: yPos,
                        head: [['Date', 'Type', 'Symbol', 'Quantity', 'Price', 'Amount']],
                        body: txData,
                        theme: 'plain',
                        styles: {
                            fontSize: 8,
                            cellPadding: 3,
                        },
                        headStyles: {
                            fillColor: colors.darkBg,
                            textColor: colors.textWhite,
                            fontStyle: 'bold',
                        },
                        bodyStyles: {
                            textColor: [51, 51, 51],
                        },
                        alternateRowStyles: {
                            fillColor: [245, 247, 250],
                        },
                        columnStyles: {
                            0: { cellWidth: contentWidth * 0.16 },
                            1: { cellWidth: contentWidth * 0.14, fontStyle: 'bold' },
                            2: { cellWidth: contentWidth * 0.16, fontStyle: 'bold', textColor: colors.brandGreen },
                            3: { halign: 'right', cellWidth: contentWidth * 0.18 },
                            4: { halign: 'right', cellWidth: contentWidth * 0.18 },
                            5: { halign: 'right', cellWidth: contentWidth * 0.18 },
                        },
                        tableWidth: contentWidth,
                        margin: { left: margin, right: margin },
                        didParseCell: function(data) {
                            if (data.section === 'body' && data.column.index === 1) {
                                if (data.cell.raw === 'BUY') {
                                    data.cell.styles.textColor = colors.accentGreen;
                                } else if (data.cell.raw === 'SELL') {
                                    data.cell.styles.textColor = colors.accentRed;
                                }
                            }
                        }
                    });

                    if (transactions.length > 20) {
                        yPos = doc.lastAutoTable.finalY + 4;
                        doc.setFontSize(7);
                        doc.setTextColor(colors.textGray[0], colors.textGray[1], colors.textGray[2]);
                        doc.text('Showing 20 of ' + transactions.length + ' transactions', margin, yPos);
                    }
                }
            } catch (err) {
                console.log('Could not load transactions:', err);
            }

            // ===== FOOTER =====
            const totalPages = doc.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);

                doc.setFillColor(colors.darkBg[0], colors.darkBg[1], colors.darkBg[2]);
                doc.rect(0, pageHeight - 22, pageWidth, 22, 'F');

                doc.setFillColor(colors.brandGreen[0], colors.brandGreen[1], colors.brandGreen[2]);
                doc.rect(0, pageHeight - 22, pageWidth, 1, 'F');

                doc.setFontSize(8);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(colors.textGray[0], colors.textGray[1], colors.textGray[2]);
                doc.text('INVEST', margin, pageHeight - 14);
                doc.setTextColor(colors.brandGreen[0], colors.brandGreen[1], colors.brandGreen[2]);
                doc.text('ED', margin + 12, pageHeight - 14);

                doc.setFont('helvetica', 'normal');
                doc.setTextColor(colors.textGray[0], colors.textGray[1], colors.textGray[2]);
                doc.text('Page ' + i + ' of ' + totalPages, pageWidth / 2, pageHeight - 14, { align: 'center' });
                doc.text(now.toLocaleDateString(), pageWidth - margin, pageHeight - 14, { align: 'right' });

                doc.setFontSize(5.5);
                doc.text('EDUCATIONAL PURPOSE ONLY: InvestED is a financial literacy and education platform. This statement is simulated and does not represent real investments, securities, or financial advice.', margin, pageHeight - 8);
                doc.text('No real money is involved. Do not make financial decisions based on this document. Consult a licensed financial advisor for real investment advice.', margin, pageHeight - 4);
            }

            doc.save('InvestED_Statement_' + now.toISOString().split('T')[0] + '.pdf');

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setExportingPDF(false);
        }
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
            try {
                await axios.post(
                    'http://localhost:8080/api/portfolios/' + selectedPosition.portfolioId + '/sell',
                    {
                        positionId: selectedPosition.id,
                        quantity: sharesToSell,
                        currentPrice: selectedPosition.currentPrice
                    }
                );

                alert('Successfully sold ' + formatShares(sharesToSell) + ' shares of ' + selectedPosition.symbol.replace('CRYPTO:', '') + '!');

                const [portfoliosRes, positionsRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/portfolios/user/1'),
                    axios.get('http://localhost:8080/api/portfolios/user/1/all-positions')
                ]);

                setPortfolios(portfoliosRes.data);
                setPositions(positionsRes.data);

                setShowSellModal(false);
                setSelectedPosition(null);
                setSellAmount('');
                setShowConfirmation(false);
            } catch (error) {
                console.error('Sell failed:', error);
                alert('Sell failed: ' + (error.response?.data || error.message));
            }
        }
    };

    const getSortIcon = (column) => {
        if (sortBy !== column) return '↕';
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const assetTypes = [...new Set(positions.map(p => p.assetType).filter(Boolean))];

    if (loading && positions.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Portfolio</h1>
                    <p className={styles.subtitle}>Loading your positions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Portfolio</h1>
                    <p className={styles.subtitle}>Manage your investment positions</p>
                </div>
                <div className={styles.headerActions}>
                    {portfolios.length > 0 && (
                        <select
                            className={styles.portfolioSelect}
                            value={selectedPortfolioId}
                            onChange={(e) => setSelectedPortfolioId(e.target.value)}
                        >
                            <option value="all">All Portfolios</option>
                            {portfolios.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    )}
                    <button 
                        className={styles.exportBtn}
                        onClick={exportToPDF}
                        disabled={exportingPDF}
                    >
                        <Download size={18} />
                        {exportingPDF ? 'Exporting...' : 'Export PDF'}
                    </button>
                </div>
            </div>

            <div className={styles.summaryCards}>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}><Briefcase size={24} /></div>
                    <div className={styles.summaryInfo}>
                        <span className={styles.summaryLabel}>Total Value</span>
                        <span className={styles.summaryValue}>{formatCurrency(portfolioTotals.totalValue)}</span>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}><DollarSign size={24} /></div>
                    <div className={styles.summaryInfo}>
                        <span className={styles.summaryLabel}>Cost Basis</span>
                        <span className={styles.summaryValue}>{formatCurrency(portfolioTotals.totalCost)}</span>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>
                        {portfolioTotals.totalGainLoss >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                    </div>
                    <div className={styles.summaryInfo}>
                        <span className={styles.summaryLabel}>Total Gain/Loss</span>
                        <span className={styles.summaryValue + ' ' + (portfolioTotals.totalGainLoss >= 0 ? styles.positive : styles.negative)}>
                            {formatCurrency(portfolioTotals.totalGainLoss)}
                        </span>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}><BarChart3 size={24} /></div>
                    <div className={styles.summaryInfo}>
                        <span className={styles.summaryLabel}>Return</span>
                        <span className={styles.summaryValue + ' ' + (totalGainLossPercent >= 0 ? styles.positive : styles.negative)}>
                            {formatPercent(totalGainLossPercent)}
                        </span>
                    </div>
                </div>
            </div>

            <div className={styles.controls}>
                <div className={styles.searchBox}>
                    <Search size={18} className={styles.searchIcon} />
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
                        className={styles.filterBtn + ' ' + (filter === 'all' ? styles.active : '')}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    {assetTypes.map(type => (
                        <button
                            key={type}
                            className={styles.filterBtn + ' ' + (filter === type.toLowerCase() ? styles.active : '')}
                            onClick={() => setFilter(type.toLowerCase())}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

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
                                            <span className={styles.assetSymbol}>{position.symbol.replace('CRYPTO:', '')}</span>
                                            <span className={styles.assetName}>{position.name.replace('CRYPTO:', '')}</span>
                                        </div>
                                    </td>
                                    <td>{formatShares(position.quantity)}</td>
                                    <td>{formatCurrency(position.averageBuyPrice)}</td>
                                    <td>{formatCurrency(position.currentPrice)}</td>
                                    <td className={styles.valueCell}>{formatCurrency(metrics.marketValue)}</td>
                                    <td>
                                        <span className={styles.gainLoss + ' ' + (isPositive ? styles.positive : styles.negative)}>
                                            {isPositive ? '▲' : '▼'} {formatCurrency(Math.abs(metrics.gainLoss))}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={styles.returnBadge + ' ' + (isPositive ? styles.positive : styles.negative)}>
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

            {filteredPositions.length === 0 && !loading && (
                <div className={styles.emptyState}>
                    <Inbox size={64} className={styles.emptyIcon} />
                    <h3>No positions found</h3>
                    <p>Try adjusting your filters or search term</p>
                </div>
            )}

            {showSellModal && selectedPosition && (
                <div className={styles.modalOverlay} onClick={() => setShowSellModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        {!showConfirmation ? (
                            <>
                                <div className={styles.modalHeader}>
                                    <h2>Sell {selectedPosition.symbol.replace('CRYPTO:', '')}</h2>
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
                                    <div className={styles.confirmIcon}><AlertTriangle size={48} /></div>
                                    <h3>Are you sure?</h3>
                                    <p>You are about to sell:</p>

                                    <div className={styles.confirmDetails}>
                                        <div className={styles.confirmRow}>
                                            <span>Asset</span>
                                            <span>{selectedPosition.symbol.replace('CRYPTO:', '')}</span>
                                        </div>
                                        <div className={styles.confirmRow}>
                                            <span>Shares</span>
                                            <span>{formatShares(parseFloat(sellAmount))}</span>
                                        </div>
                                        <div className={styles.confirmRow}>
                                            <span>Price</span>
                                            <span>{formatCurrency(selectedPosition.currentPrice)}</span>
                                        </div>
                                        <div className={styles.confirmRow + ' ' + styles.total}>
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
