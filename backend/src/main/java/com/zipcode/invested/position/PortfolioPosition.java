package com.zipcode.invested.position;

import com.zipcode.invested.asset.Asset;
import com.zipcode.invested.portfolio.Portfolio;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(
        name = "portfolio_position",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_portfolio_asset",
                columnNames = {"portfolio_id", "asset_id"}
        )
)
public class PortfolioPosition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "portfolio_id", nullable = false)
    private Portfolio portfolio;

    @ManyToOne(optional = false)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Column(nullable = false, precision = 19, scale = 6)
    private BigDecimal quantity;

    @Column(nullable = false, precision = 19, scale = 6)
    private BigDecimal averageBuyPrice;

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    protected PortfolioPosition() {}

    public PortfolioPosition(Portfolio portfolio, Asset asset, BigDecimal quantity, BigDecimal averageBuyPrice) {
        this.portfolio = portfolio;
        this.asset = asset;
        this.quantity = quantity;
        this.averageBuyPrice = averageBuyPrice;
    }

    public Long getId() { return id; }
    public Portfolio getPortfolio() { return portfolio; }
    public Asset getAsset() { return asset; }
    public BigDecimal getQuantity() { return quantity; }
    public BigDecimal getAverageBuyPrice() { return averageBuyPrice; }
    public Instant getUpdatedAt() { return updatedAt; }

    public void setPortfolio(Portfolio portfolio) { this.portfolio = portfolio; }
    public void setAsset(Asset asset) { this.asset = asset; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    public void setAverageBuyPrice(BigDecimal averageBuyPrice) { this.averageBuyPrice = averageBuyPrice; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
