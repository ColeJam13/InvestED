import React, { useState, useEffect } from 'react';
import { marketService } from '../../services/marketService';
import styles from './AssetDetails.module.css';

function AssetDetails({ symbol }) {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      setLoading(true);
      try {
        const data = await marketService.getAssetQuote(symbol);
        setQuote(data);
      } catch (error) {
        console.error('Failed to fetch quote:', error);
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchQuote();
    }
  }, [symbol]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!quote) return <div className={styles.error}>Unable to load asset details</div>;

  const changeColor = quote.percent_change >= 0 ? '#4CAF50' : '#D32F2F';

  return (
    <div className={styles.assetDetails}>
      <h2>{quote.symbol}</h2>
      <h3>{quote.name}</h3>
      
      <div className={styles.priceSection}>
        <div className={styles.currentPrice}>${quote.close}</div>
        <div className={styles.priceChange} style={{ color: changeColor }}>
          {quote.change} ({quote.percent_change}%)
        </div>
      </div>

      <div className={styles.assetInfo}>
        <div className={styles.infoRow}>
          <span>Open:</span>
          <span>${quote.open}</span>
        </div>
        <div className={styles.infoRow}>
          <span>High:</span>
          <span>${quote.high}</span>
        </div>
        <div className={styles.infoRow}>
          <span>Low:</span>
          <span>${quote.low}</span>
        </div>
        <div className={styles.infoRow}>
          <span>Volume:</span>
          <span>{quote.volume}</span>
        </div>
      </div>

      <button className={styles.buyButton}>Buy {quote.symbol}</button>
    </div>
  );
}

export default AssetDetails;