import { useState, useEffect } from 'react';
import styles from './BuyModal.module.css';

function BuyModal({ asset, currentPrice, onClose, onSuccess }) {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Fetch user's portfolios (hardcoded userId=1 for demo)
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/portfolios/user/1');
        const data = await response.json();
        setPortfolios(data);
        if (data.length > 0) {
          setSelectedPortfolio(data[0]); // Default to first portfolio
        }
      } catch (err) {
        console.error('Failed to fetch portfolios:', err);
        setError('Failed to load portfolios');
      }
    };
    fetchPortfolios();
  }, []);

  const totalCost = quantity ? (parseFloat(quantity) * currentPrice).toFixed(2) : '0.00';
  const sufficientFunds = selectedPortfolio && parseFloat(totalCost) <= selectedPortfolio.cashBalance;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sufficientFunds) {
      setError('Insufficient funds');
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmBuy = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8080/api/portfolios/${selectedPortfolio.id}/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: asset.symbol,
          assetName: asset.name || asset.symbol,
          assetType: asset.type || 'STOCK',
          quantity: parseFloat(quantity),
          currentPrice: currentPrice,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Purchase failed');
      }

      const data = await response.json();
      onSuccess && onSuccess(data);
      onClose();
    } catch (err) {
      console.error('Buy error:', err);
      setError(err.message);
      setShowConfirmation(false);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {!showConfirmation ? (
          <>
            <div className={styles.modalHeader}>
              <h2>Buy {asset.symbol.replace('CRYPTO:', '')}</h2>
              <button className={styles.closeBtn} onClick={onClose}>×</button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Portfolio Selection */}
              <div className={styles.formGroup}>
                <label>Select Portfolio</label>
                <select
                  value={selectedPortfolio?.id || ''}
                  onChange={(e) => {
                    const portfolio = portfolios.find(p => p.id === parseInt(e.target.value));
                    setSelectedPortfolio(portfolio);
                  }}
                  className={styles.select}
                  required
                >
                  {portfolios.map((portfolio) => (
                    <option key={portfolio.id} value={portfolio.id}>
                      {portfolio.name} - {formatCurrency(portfolio.cashBalance)} available
                    </option>
                  ))}
                </select>
              </div>

              {/* Asset Info */}
              <div className={styles.assetInfo}>
                <div className={styles.infoRow}>
                  <span>Current Price</span>
                  <span className={styles.price}>{formatCurrency(currentPrice)}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Cash Available</span>
                  <span className={styles.cash}>
                    {selectedPortfolio ? formatCurrency(selectedPortfolio.cashBalance) : '--'}
                  </span>
                </div>
              </div>

              {/* Quantity Input */}
              <div className={styles.formGroup}>
                <label>Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0.00"
                  step="0.0001"
                  min="0.0001"
                  required
                  className={styles.input}
                />
              </div>

              {/* Total Cost Preview */}
              {quantity && (
                <div className={styles.costPreview}>
                  <div className={styles.previewRow}>
                    <span>Total Cost</span>
                    <span className={styles.totalCost}>{formatCurrency(totalCost)}</span>
                  </div>
                  {!sufficientFunds && (
                    <div className={styles.errorMessage}>
                      ⚠️ Insufficient funds
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div className={styles.errorMessage}>
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={onClose}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.buyBtn}
                  disabled={!sufficientFunds || !quantity}
                >
                  Review Order
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className={styles.modalHeader}>
              <h2>Confirm Purchase</h2>
              <button className={styles.closeBtn} onClick={onClose}>×</button>
            </div>

            <div className={styles.confirmationContent}>
              <div className={styles.confirmIcon}>🛒</div>
              <h3>Review Your Order</h3>
              
              <div className={styles.confirmDetails}>
                <div className={styles.confirmRow}>
                  <span>Asset</span>
                  <span>{asset.symbol.replace('CRYPTO:', '')}</span>
                </div>
                <div className={styles.confirmRow}>
                  <span>Portfolio</span>
                  <span>{selectedPortfolio?.name}</span>
                </div>
                <div className={styles.confirmRow}>
                  <span>Quantity</span>
                  <span>{parseFloat(quantity).toFixed(4)}</span>
                </div>
                <div className={styles.confirmRow}>
                  <span>Price per Share</span>
                  <span>{formatCurrency(currentPrice)}</span>
                </div>
                <div className={`${styles.confirmRow} ${styles.total}`}>
                  <span>Total Cost</span>
                  <span>{formatCurrency(totalCost)}</span>
                </div>
                <div className={styles.confirmRow}>
                  <span>Remaining Cash</span>
                  <span>
                    {formatCurrency(selectedPortfolio.cashBalance - parseFloat(totalCost))}
                  </span>
                </div>
              </div>

              {error && (
                <div className={styles.errorMessage}>
                  {error}
                </div>
              )}

              <div className={styles.formActions}>
                <button 
                  className={styles.cancelBtn} 
                  onClick={() => setShowConfirmation(false)}
                  disabled={loading}
                >
                  Go Back
                </button>
                <button 
                  className={styles.confirmBtn} 
                  onClick={handleConfirmBuy}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Confirm Purchase'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BuyModal;