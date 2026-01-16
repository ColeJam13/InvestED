package com.zipcode.invested.snapshot;

import com.zipcode.invested.portfolio.Portfolio;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "portfolio_snapshot")
public class PortfolioSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "portfolio_id", nullable = false)
    private Portfolio portfolio;

    @Column(nullable = false)
    private Instant capturedAt = Instant.now();

    @Column(nullable = false, columnDefinition = "text")
    private String snapshotData;

    protected PortfolioSnapshot() {}

    public PortfolioSnapshot(Portfolio portfolio, String snapshotData) {
        this.portfolio = portfolio;
        this.snapshotData = snapshotData;
    }

    public Long getId() { return id; }
    public Portfolio getPortfolio() { return portfolio; }
    public Instant getCapturedAt() { return capturedAt; }
    public String getSnapshotData() { return snapshotData; }

    public void setPortfolio(Portfolio portfolio) { this.portfolio = portfolio; }
    public void setCapturedAt(Instant capturedAt) { this.capturedAt = capturedAt; }
    public void setSnapshotData(String snapshotData) { this.snapshotData = snapshotData; }
}
