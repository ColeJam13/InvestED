import React, { useState, useEffect } from 'react';
import { marketService } from '../services/marketService';

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

  if (loading) return <div>Loading...</div>;
  if (!quote) return <div>Select an asset to view details</div>;

  const changeColor = quote.percent_change >= 0 ? '#4CAF50' : '#D32F2F';

  return (
    <div className="asset-details">
      <h2>{quote.symbol}</h2>
      <h3>{quote.name}</h3>
      
      <div className="price-section">
        <div className="current-price">${quote.close}</div>
        <div className="price-change" style={{ color: changeColor }}>
          {quote.change} ({quote.percent_change}%)
        </div>
      </div>

      <div className="asset-info">
        <div className="info-row">
          <span>Open:</span>
          <span>${quote.open}</span>
        </div>
        <div className="info-row">
          <span>High:</span>
          <span>${quote.high}</span>
        </div>
        <div className="info-row">
          <span>Low:</span>
          <span>${quote.low}</span>
        </div>
        <div className="info-row">
          <span>Volume:</span>
          <span>{quote.volume}</span>
        </div>
      </div>

      <button className="buy-button">Buy {symbol}</button>
    </div>
  );
}

export default AssetDetails;