package com.zipcode.invested.transaction;

import com.zipcode.invested.asset.Asset;
import com.zipcode.invested.portfolio.Portfolio;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "transaction")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "portfolio_id", nullable = false)
    private Portfolio portfolio;

    @ManyToOne(optional = false)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Column(nullable = false, length = 10)
    private String transactionType; 

    @Column(nullable = false, precision = 19, scale = 6)
    private BigDecimal quantity;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal priceAtTransaction;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal totalAmount; 

    @Column(nullable = false)
    private Instant transactionDate = Instant.now();

    public Transaction() {}

    public Transaction(Portfolio portfolio, Asset asset, String transactionType, 
                       BigDecimal quantity, BigDecimal priceAtTransaction) {
        this.portfolio = portfolio;
        this.asset = asset;
        this.transactionType = transactionType;
        this.quantity = quantity;
        this.priceAtTransaction = priceAtTransaction;
        this.totalAmount = quantity.multiply(priceAtTransaction);
    }

    public Long getId() { return id; }
    public Portfolio getPortfolio() { return portfolio; }
    public Asset getAsset() { return asset; }
    public String getTransactionType() { return transactionType; }
    public BigDecimal getQuantity() { return quantity; }
    public BigDecimal getPriceAtTransaction() { return priceAtTransaction; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public Instant getTransactionDate() { return transactionDate; }

    public void setPortfolio(Portfolio portfolio) { this.portfolio = portfolio; }
    public void setAsset(Asset asset) { this.asset = asset; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    public void setPriceAtTransaction(BigDecimal priceAtTransaction) { this.priceAtTransaction = priceAtTransaction; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public void setTransactionDate(Instant transactionDate) { this.transactionDate = transactionDate; }
}