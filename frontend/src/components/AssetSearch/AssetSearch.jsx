import React, { useState, useRef, useEffect } from 'react';
import { marketService } from '../../services/marketService';
import styles from './AssetSearch.module.css';

function AssetSearch({ onAssetSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState('stock'); // 'stock' or 'crypto'
  const timeoutRef = useRef(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSearch = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (searchQuery.length > 1) {
      setLoading(true);
      
      // Wait 500ms after user stops typing before searching
      timeoutRef.current = setTimeout(async () => {
        try {
          const data = await marketService.searchAssets(searchQuery, searchType);
          setResults(data.data || []);
        } catch (error) {
          console.error('Search failed:', error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, 500);
    } else {
      setResults([]);
      setLoading(false);
    }
  };

  // Re-search when toggle changes
  useEffect(() => {
    if (query.length > 1) {
      handleSearch({ target: { value: query } });
    }
  }, [searchType]);

  return (
    <div className={styles.assetSearch}>
      {/* Toggle buttons */}
      <div className={styles.searchToggle}>
        <button
          className={`${styles.toggleBtn} ${searchType === 'stock' ? styles.active : ''}`}
          onClick={() => setSearchType('stock')}
        >
          Stocks
        </button>
        <button
          className={`${styles.toggleBtn} ${searchType === 'crypto' ? styles.active : ''}`}
          onClick={() => setSearchType('crypto')}
        >
          Crypto
        </button>
      </div>

      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder={searchType === 'stock' ? 'Search stocks (e.g., AAPL, Tesla)' : 'Search crypto (e.g., BTC, Bitcoin)'}
        className={styles.searchInput}
      />
      {loading && <div className={styles.loading}>Searching...</div>}
      {results.length > 0 && (
        <div className={styles.searchResults}>
          {results.map((asset, index) => (
            <div 
              key={index} 
              className={styles.searchResultItem}
              onClick={() => onAssetSelect(asset.symbol)}
            >
              <div className={styles.resultSymbol}>{asset.displaySymbol || asset.symbol}</div>
              <div className={styles.resultName}>{asset.instrument_name}</div>
              <div className={styles.resultType}>{asset.instrument_type}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AssetSearch;