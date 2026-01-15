import { useState, useEffect, useRef } from 'react';
import { BarChart3, X, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import AssetSearch from '../AssetSearch';
import { marketService } from '../../services/marketService';
import styles from './StockComparison.module.css';


const StockComparison = ({ baseSymbol, onClose }) => {
  const [compareList, setCompareList] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const hasLoadedBase = useRef(false);

  // Fetch quote data for a symbol
  const fetchQuoteData = async (symbol) => {
    try {
      const quote = await marketService.getAssetQuote(symbol);
      return {
        symbol: symbol.replace('CRYPTO:', ''),
        name: quote.name || symbol,
        price: `$${quote.close}`,
        change24h: parseFloat(quote.percent_change),
        marketCap: 'N/A',
        volume: quote.volume,
        high52w: 'N/A',
        low52w: 'N/A'
      };
    } catch (error) {
      console.error('Failed to fetch quote for comparison:', error);
      return null;
    }
  };

    // Add asset to comparison
    const handleAddAsset = async (symbol) => {
    const cleanSymbol = symbol.replace('CRYPTO:', '');
    
    if (compareList.length >= 3) {
        alert('Maximum 3 assets for comparison');
        return;
    }

    if (compareList.some(a => a.symbol === cleanSymbol)) {
        alert('Asset already in comparison');
        return;
    }

    setLoadingQuotes(true);
    const quoteData = await fetchQuoteData(symbol);
    if (quoteData) {
        setCompareList(prev => [...prev, quoteData]);
    }
    setLoadingQuotes(false);
    setShowSearch(false);
    };

  // Load base symbol on mount
  useEffect(() => {
    if (baseSymbol && !hasLoadedBase.current) {
        hasLoadedBase.current = true;
        handleAddAsset(baseSymbol);
    }
  }, [baseSymbol]);

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

  const metrics = [
    { key: 'price', label: 'Price' },
    { key: 'change24h', label: '24h Change' },
    { key: 'marketCap', label: 'Market Cap' },
    { key: 'volume', label: 'Volume' },
    { key: 'high52w', label: '52W High' },
    { key: 'low52w', label: '52W Low' },
  ];

  if (compareList.length === 0 && !showSearch) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Compare Assets</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className={styles.emptyState}>
          <BarChart3 size={64} className={styles.emptyIcon} />
          <h3>No assets to compare</h3>
          <p>Add assets to start comparing</p>
          <button className={styles.addBtn} onClick={() => setShowSearch(true)}>
            <Plus size={20} />
            Add Asset
          </button>
        </div>
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

      {showSearch && (
        <div className={styles.searchOverlay}>
          <div className={styles.searchModal}>
            <h3>Add Asset to Compare</h3>
            <AssetSearch onAssetSelect={handleAddAsset} />
            <button 
              className={styles.cancelBtn} 
              onClick={() => setShowSearch(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
              <button 
                className={styles.addBtn} 
                onClick={() => setShowSearch(true)}
                disabled={loadingQuotes}
              >
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