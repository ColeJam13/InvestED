import React, { useState } from 'react';
import { marketService } from '../../services/marketService';
import styles from './AssetSearch.module.css';

function AssetSearch({ onAssetSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    if (searchQuery.length > 1) {
      setLoading(true);
      try {
        const data = await marketService.searchAssets(searchQuery);
        setResults(data.data || []);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setResults([]);
    }
  };

  return (
    <div className={styles.assetSearch}>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search stocks or crypto (e.g., AAPL, BTC)"
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
              <div className={styles.resultSymbol}>{asset.symbol}</div>
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