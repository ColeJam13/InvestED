package com.zipcode.invested.dto;

import java.math.BigDecimal;
import java.util.Map;

public class PortfolioSummary {

    private Long portfolioId;
    private String portfolioName;

    private BigDecimal totalCostBasis;
    private BigDecimal totalMarketValue;
    private BigDecimal totalProfitLoss;

    private Map<String, BigDecimal> allocationByType;

    public PortfolioSummary() {}

    public PortfolioSummary(
            Long portfolioId,
            String portfolioName,
            BigDecimal totalCostBasis,
            BigDecimal totalMarketValue,
            BigDecimal totalProfitLoss,
            Map<String, BigDecimal> allocationByType
    ) {
        this.portfolioId = portfolioId;
        this.portfolioName = portfolioName;
        this.totalCostBasis = totalCostBasis;
        this.totalMarketValue = totalMarketValue;
        this.totalProfitLoss = totalProfitLoss;
        this.allocationByType = allocationByType;
    }

    public Long getPortfolioId() { return portfolioId; }
    public String getPortfolioName() { return portfolioName; }
    public BigDecimal getTotalCostBasis() { return totalCostBasis; }
    public BigDecimal getTotalMarketValue() { return totalMarketValue; }
    public BigDecimal getTotalProfitLoss() { return totalProfitLoss; }
    public Map<String, BigDecimal> getAllocationByType() { return allocationByType; }

    public void setPortfolioId(Long portfolioId) { this.portfolioId = portfolioId; }
    public void setPortfolioName(String portfolioName) { this.portfolioName = portfolioName; }
    public void setTotalCostBasis(BigDecimal totalCostBasis) { this.totalCostBasis = totalCostBasis; }
    public void setTotalMarketValue(BigDecimal totalMarketValue) { this.totalMarketValue = totalMarketValue; }
    public void setTotalProfitLoss(BigDecimal totalProfitLoss) { this.totalProfitLoss = totalProfitLoss; }
    public void setAllocationByType(Map<String, BigDecimal> allocationByType) { this.allocationByType = allocationByType; }
}
