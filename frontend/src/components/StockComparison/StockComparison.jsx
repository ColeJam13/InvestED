import React, { useState, useEffect } from 'react';
import { marketService } from '../../services/marketService';
import styles from './StockComparison.module.css';

function StockComparison({ baseSymbol, onClose }) {
  const [compareSymbol, setCompareSymbol] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [baseData, setBaseData] = useState(null);
  const [compareData, setCompareData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    // Fetch base stock data
    const fetchBaseData = async () => {
      try {
        const data = await marketService.getAssetQuote(baseSymbol);
        setBaseData(data);
      } catch (error) {
        console.error('Failed to fetch base stock:', error);
      }
    };
    fetchBaseData();
  }, [baseSymbol]);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setCompareSymbol(query);

    if (query.length > 1) {
      setSearchLoading(true);
      try {
        const data = await marketService.searchAssets(query);
        setSearchResults(data.data || []);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setSearchLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectStock = async (symbol) => {
    setCompareSymbol(symbol);
    setSearchResults([]);
    setLoading(true);
    try {
      const data = await marketService.getAssetQuote(symbol);
      setCompareData(data);
    } catch (error) {
      console.error('Failed to fetch comparison stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const MetricRow = ({ label, base, compare }) => (
    <div className={styles.metricRow}>
      <div className={styles.metricLabel}>{label}</div>
      <div className={styles.metricValue}>{base}</div>
      <div className={styles.metricValue}>{compare}</div>
    </div>
  );

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Compare Stocks</h2>
          <button className={styles.closeButton} onClick={onClose}>✕</button>
        </div>

        {/* Search Section */}
        <div className={styles.searchSection}>
          <div className={styles.searchLabel}>
            Compare <strong>{baseSymbol}</strong> with:
          </div>
          <div className={styles.searchInputContainer}>
            <input
              type="text"
              value={compareSymbol}
              onChange={handleSearch}
              placeholder="Search for a stock or crypto..."
              className={styles.searchInput}
            />
            {searchLoading && <div className={styles.searchSpinner}>Searching...</div>}
          </div>

          {searchResults.length > 0 && (
            <div className={styles.searchResults}>
              {searchResults.map((asset, index) => (
                <div
                  key={index}
                  className={styles.searchResultItem}
                  onClick={() => handleSelectStock(asset.symbol)}
                >
                  <span className={styles.resultSymbol}>{asset.symbol}</span>
                  <span className={styles.resultName}>{asset.instrument_name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comparison Table */}
        {baseData && compareData ? (
          <div className={styles.comparisonTable}>
            <div className={styles.tableHeader}>
              <div className={styles.headerLabel}>Metric</div>
              <div className={styles.headerStock}>
                <div className={styles.stockSymbol}>{baseData.symbol}</div>
                <div className={styles.stockName}>{baseData.name}</div>
              </div>
              <div className={styles.headerStock}>
                <div className={styles.stockSymbol}>{compareData.symbol}</div>
                <div className={styles.stockName}>{compareData.name}</div>
              </div>
            </div>

            <div className={styles.tableBody}>
              <MetricRow
                label="Current Price"
                base={`$${baseData.close}`}
                compare={`$${compareData.close}`}
              />
              <MetricRow
                label="Change"
                base={
                  <span style={{ color: baseData.percent_change >= 0 ? '#4CAF50' : '#D32F2F' }}>
                    {baseData.change} ({baseData.percent_change}%)
                  </span>
                }
                compare={
                  <span style={{ color: compareData.percent_change >= 0 ? '#4CAF50' : '#D32F2F' }}>
                    {compareData.change} ({compareData.percent_change}%)
                  </span>
                }
              />
              <MetricRow
                label="Open"
                base={`$${baseData.open}`}
                compare={`$${compareData.open}`}
              />
              <MetricRow
                label="High"
                base={`$${baseData.high}`}
                compare={`$${compareData.high}`}
              />
              <MetricRow
                label="Low"
                base={`$${baseData.low}`}
                compare={`$${compareData.low}`}
              />
              <MetricRow
                label="Volume"
                base={baseData.volume?.toLocaleString() || 'N/A'}
                compare={compareData.volume?.toLocaleString() || 'N/A'}
              />
            </div>
          </div>
        ) : loading ? (
          <div className={styles.loadingState}>Loading comparison data...</div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📊</div>
            <p>Search for a stock above to compare with {baseSymbol}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StockComparison;