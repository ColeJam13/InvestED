import React, { useState } from 'react';
import { marketService } from '../services/marketService';

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
    <div className="asset-search">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search stocks or crypto (e.g., AAPL, BTC)"
        className="search-input"
      />
      
      {loading && <div>Searching...</div>}
      
      {results.length > 0 && (
        <div className="search-results">
          {results.map((asset, index) => (
            <div 
              key={index} 
              className="search-result-item"
              onClick={() => onAssetSelect(asset.symbol)}
            >
              <div className="result-symbol">{asset.symbol}</div>
              <div className="result-name">{asset.instrument_name}</div>
              <div className="result-type">{asset.instrument_type}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AssetSearch;