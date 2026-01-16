import * as styles from './MarketsView.module.css';
import React, { useState, useEffect } from 'react';
import { Flame, TrendingUp } from 'lucide-react';
import AssetSearch from '../../components/AssetSearch';
import AssetDetails from '../../components/AssetDetails';
import { marketService } from '../../services/marketService';

console.log('STYLES OBJECT:', styles);

function MarketsView() {
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [trendingAssets, setTrendingAssets] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await marketService.getTrending();
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
        setTrendingAssets([
          { symbol: 'AAPL', name: 'Apple Inc.', change: '+0.34%', positive: true },
          { symbol: 'NVDA', name: 'NVIDIA Corp.', change: '+0.04%', positive: true },
          { symbol: 'TSLA', name: 'Tesla Inc.', change: '+0.89%', positive: true },
          { symbol: 'MSFT', name: 'Microsoft Corp.', change: '-0.44%', positive: false },
          { symbol: 'META', name: 'Meta Platforms', change: '-1.70%', positive: false },
        ]);
      }
    };
    fetchTrending();
    const interval = setInterval(fetchTrending, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.marketsView}>
      <div className={styles.searchSection}>
        <h1>Search Assets</h1>
        <AssetSearch onAssetSelect={setSelectedSymbol} />
        
        <div className={styles.trendingSection}>
          <h2><Flame size={24} style={{ verticalAlign: 'middle', marginRight: '8px' }} />Trending Today</h2>
          <div className={styles.trendingList}>
            {trendingAssets.map((asset) => (
              <div 
                key={asset.symbol} 
                className={styles.trendingItem}
                onClick={() => setSelectedSymbol(asset.symbol)}
              >
                <div className={styles.trendingInfo}>
                  <div className={styles.trendingSymbol}>{asset.symbol}</div>
                  <div className={styles.trendingName}>{asset.name}</div>
                </div>
                <div className={`${styles.trendingChange} ${asset.positive ? styles.positive : styles.negative}`}>
                  {asset.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className={styles.detailsSection}>
        {selectedSymbol ? (
          <AssetDetails symbol={selectedSymbol} />
        ) : (
          <div className={styles.emptyState}>
            <TrendingUp size={64} className={styles.emptyIcon} />
            <h2>Select an asset to view details</h2>
            <p>Search for a stock or crypto above, or click on a trending asset to get started.</p>
            <div className={styles.quickActions}>
              <button 
                className={styles.quickActionBtn}
                onClick={() => setSelectedSymbol('AAPL')}
              >
                View Apple
              </button>
              <button 
                className={styles.quickActionBtn}
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
