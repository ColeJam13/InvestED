import '../styles/MarketsView.css';
import React, { useState, useEffect } from 'react';
import AssetSearch from '../components/AssetSearch';
import AssetDetails from '../components/AssetDetails';
import { marketService } from '../services/marketService';

function MarketsView() {
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [trendingAssets, setTrendingAssets] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await marketService.getTrending();
        // Transform Finnhub data to your format
        const formatted = data.map((item, index) => {
          const symbols = ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'META'];
          const names = ['Apple Inc.', 'NVIDIA Corp.', 'Tesla Inc.', 'Microsoft Corp.', 'Meta Platforms'];
          const changePercent = item.dp || 0;
          
          return {
            symbol: symbols[index],
            name: names[index],
            change: `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
            positive: changePercent >= 0
          };
        });
        setTrendingAssets(formatted);
      } catch (error) {
        console.error('Failed to fetch trending:', error);
        // Fallback to hardcoded if API fails
        setTrendingAssets([
          { symbol: 'AAPL', name: 'Apple Inc.', change: '+2.3%', positive: true },
          { symbol: 'NVDA', name: 'NVIDIA Corp.', change: '+5.7%', positive: true },
          { symbol: 'TSLA', name: 'Tesla Inc.', change: '-0.8%', positive: false },
          { symbol: 'MSFT', name: 'Microsoft Corp.', change: '+1.5%', positive: true },
          { symbol: 'META', name: 'Meta Platforms', change: '+3.1%', positive: true },
        ]);
      }
    };

    fetchTrending();
    // Refresh every 5 minutes
    const interval = setInterval(fetchTrending, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="markets-view">
      <div className="search-section">
        <h1>Search Assets</h1>
        <AssetSearch onAssetSelect={setSelectedSymbol} />
        
        <div className="trending-section">
          <h2>🔥 Trending Today</h2>
          <div className="trending-list">
            {trendingAssets.map((asset) => (
              <div 
                key={asset.symbol} 
                className="trending-item"
                onClick={() => setSelectedSymbol(asset.symbol)}
              >
                <div className="trending-info">
                  <div className="trending-symbol">{asset.symbol}</div>
                  <div className="trending-name">{asset.name}</div>
                </div>
                <div className={`trending-change ${asset.positive ? 'positive' : 'negative'}`}>
                  {asset.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="details-section">
        {selectedSymbol ? (
          <AssetDetails symbol={selectedSymbol} />
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📈</div>
            <h2>Select an asset to view details</h2>
            <p>Search for a stock or crypto above, or click on a trending asset to get started.</p>
            <div className="quick-actions">
              <button 
                className="quick-action-btn"
                onClick={() => setSelectedSymbol('AAPL')}
              >
                View Apple
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => setSelectedSymbol('BTC/USD')}
              >
                View Bitcoin
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MarketsView;