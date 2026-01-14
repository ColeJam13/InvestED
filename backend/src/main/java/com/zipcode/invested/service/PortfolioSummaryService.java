package com.zipcode.invested.service;

import com.zipcode.invested.dto.PortfolioSummary;
import com.zipcode.invested.portfolio.Portfolio;
import com.zipcode.invested.position.PortfolioPosition;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PortfolioSummaryService {

    private final PortfolioService portfolioService;
    private final PortfolioPositionService positionService;
    private final MarketDataService marketDataService;

    public PortfolioSummaryService(
            PortfolioService portfolioService,
            PortfolioPositionService positionService,
            MarketDataService marketDataService
    ) {
        this.portfolioService = portfolioService;
        this.positionService = positionService;
        this.marketDataService = marketDataService;
    }

    public PortfolioSummary buildSummary(Long portfolioId) {
        Portfolio portfolio = portfolioService.findById(portfolioId)
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found: " + portfolioId));

        List<PortfolioPosition> positions = positionService.findByPortfolio(portfolio);

        BigDecimal totalCostBasis = BigDecimal.ZERO;
        BigDecimal totalMarketValue = BigDecimal.ZERO;

        Map<String, BigDecimal> marketValueByType = new HashMap<>();

        for (PortfolioPosition p : positions) {
            BigDecimal qty = nz(p.getQuantity());
            BigDecimal avgBuy = nz(p.getAverageBuyPrice());

            BigDecimal costBasis = qty.multiply(avgBuy);
            totalCostBasis = totalCostBasis.add(costBasis);

            String symbol = p.getAsset().getSymbol();
            BigDecimal priceNow = marketDataService.getCurrentPrice(symbol);

            BigDecimal marketValue = qty.multiply(priceNow);
            totalMarketValue = totalMarketValue.add(marketValue);

            String type = p.getAsset().getAssetType();
            marketValueByType.put(type, marketValueByType.getOrDefault(type, BigDecimal.ZERO).add(marketValue));
        }

        BigDecimal totalProfitLoss = totalMarketValue.subtract(totalCostBasis);

        Map<String, BigDecimal> allocationByType = new HashMap<>();
        if (totalMarketValue.compareTo(BigDecimal.ZERO) > 0) {
            for (Map.Entry<String, BigDecimal> e : marketValueByType.entrySet()) {
                BigDecimal pct = e.getValue()
                        .divide(totalMarketValue, 6, RoundingMode.HALF_UP);
                allocationByType.put(e.getKey(), pct);
            }
        }

        return new PortfolioSummary(
                portfolio.getId(),
                portfolio.getName(),
                totalCostBasis,
                totalMarketValue,
                totalProfitLoss,
                allocationByType
        );
    }

    private BigDecimal nz(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v;
    }
}
