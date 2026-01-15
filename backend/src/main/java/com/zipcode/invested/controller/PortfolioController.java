package com.zipcode.invested.controller;

import com.zipcode.invested.portfolio.Portfolio;
import com.zipcode.invested.position.PortfolioPosition;
import com.zipcode.invested.service.PortfolioService;
import com.zipcode.invested.service.UserService;
import com.zipcode.invested.service.PortfolioPositionService;
import com.zipcode.invested.service.FinnhubService;
import com.zipcode.invested.user.User;
import com.zipcode.invested.dto.BuyRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.zipcode.invested.dto.PortfolioSummary;
import com.zipcode.invested.service.PortfolioSummaryService;
import com.zipcode.invested.service.MarketDataService;


import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.math.RoundingMode;

@RestController
@RequestMapping("/api/portfolios")
@CrossOrigin(origins = "http://localhost:5173")
public class PortfolioController {

    private final PortfolioService portfolioService;
    private final UserService userService;
    private final PortfolioPositionService positionService;
    private final PortfolioSummaryService portfolioSummaryService;
    private final MarketDataService marketDataService;

    public PortfolioController(
            PortfolioService portfolioService,
            UserService userService,
            PortfolioPositionService positionService,
            FinnhubService finnhubService,
            MarketDataService marketDataService,
            PortfolioSummaryService portfolioSummaryService
    ) {

        this.portfolioService = portfolioService;
        this.userService = userService;
        this.positionService = positionService;
        this.portfolioSummaryService = portfolioSummaryService;
        this.marketDataService = marketDataService;
    }

    @GetMapping
    public List<Portfolio> getAll() {
        return portfolioService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Portfolio> getById(@PathVariable Long id) {
        return portfolioService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Portfolio>> getByUser(@PathVariable Long userId) {
        User user = userService.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(portfolioService.findByUser(user));
    }

    @GetMapping("/{id}/summary")
    public ResponseEntity<PortfolioSummary> getSummary(@PathVariable Long id) {
        return ResponseEntity.ok(portfolioSummaryService.buildSummary(id));
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<Portfolio> createForUser(@PathVariable Long userId, @RequestBody Portfolio body) {
        User user = userService.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        body.setUser(user);
        Portfolio saved = portfolioService.save(body);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PostMapping("/{portfolioId}/buy")
    public ResponseEntity<?> executeBuy(@PathVariable Long portfolioId, @RequestBody BuyRequest buyRequest) {
    try {
        String symbol = buyRequest.getSymbol();
        BigDecimal currentPrice = marketDataService.getCurrentPrice(symbol);
        buyRequest.setCurrentPrice(currentPrice);

        PortfolioPosition position = portfolioService.executeBuy(portfolioId, buyRequest);
        return ResponseEntity.ok(position);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
    }

    @PostMapping("/{portfolioId}/sell")
    public ResponseEntity<?> executeSell(
            @PathVariable Long portfolioId,
            @RequestBody Map<String, Object> sellRequest) {
        try {
           Long positionId = Long.valueOf(sellRequest.get("positionId").toString());
           BigDecimal quantity = new BigDecimal(sellRequest.get("quantity").toString());

        Portfolio portfolio = portfolioService.findById(portfolioId)
            .orElseThrow(() -> new IllegalArgumentException("Portfolio not found: " + portfolioId));

        PortfolioPosition pos = positionService.findByPortfolio(portfolio).stream()
            .filter(p -> p.getId().equals(positionId))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Position not found in portfolio: " + positionId));

        String symbol = pos.getAsset().getSymbol();
        BigDecimal currentPrice = marketDataService.getCurrentPrice(symbol);

        PortfolioPosition position = portfolioService.executeSell(portfolioId, positionId, quantity, currentPrice);

            Map<String, Object> response = new HashMap<>();
            if (position == null) {
                response.put("message", "Position fully closed");
                response.put("positionClosed", true);
            } else {
                response.put("message", "Sell successful");
                response.put("position", position);
                response.put("positionClosed", false);
            }
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}/summary")
    public ResponseEntity<Map<String, Object>> getUserPortfolioSummary(@PathVariable Long userId) {
        User user = userService.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        List<Portfolio> portfolios = portfolioService.findByUser(user);
        
        BigDecimal totalCash = BigDecimal.ZERO;
        BigDecimal totalValue = BigDecimal.ZERO;
        BigDecimal totalCostBasis = BigDecimal.ZERO;
        int totalPositions = 0;

        for (Portfolio portfolio : portfolios) {
            totalCash = totalCash.add(portfolio.getCashBalance());
            List<PortfolioPosition> positions = positionService.findByPortfolio(portfolio);
            totalPositions += positions.size();
            
        for (PortfolioPosition position : positions) {
            BigDecimal currentPrice = marketDataService.getCurrentPrice(position.getAsset().getSymbol());

            if (currentPrice.compareTo(BigDecimal.ZERO) <= 0) {
                currentPrice = position.getAverageBuyPrice();
            }

            BigDecimal positionValue = position.getQuantity().multiply(currentPrice);
            totalValue = totalValue.add(positionValue);

            BigDecimal costBasis = position.getQuantity().multiply(position.getAverageBuyPrice());
            totalCostBasis = totalCostBasis.add(costBasis);
        }

        }
        
        totalValue = totalValue.add(totalCash); 
        totalCostBasis = totalCostBasis.add(totalCash); 
        
        BigDecimal totalGainLoss = totalValue.subtract(totalCostBasis);
        BigDecimal totalGainLossPercent = BigDecimal.ZERO;
        if (totalCostBasis.compareTo(BigDecimal.ZERO) > 0) {
            totalGainLossPercent = totalGainLoss.divide(totalCostBasis, 4, RoundingMode.HALF_UP)
                                                 .multiply(BigDecimal.valueOf(100));
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalValue", totalValue);
        summary.put("totalCash", totalCash);
        summary.put("totalCostBasis", totalCostBasis);
        summary.put("totalGainLoss", totalGainLoss);
        summary.put("totalGainLossPercent", totalGainLossPercent);
        summary.put("totalPositions", totalPositions);
        summary.put("portfolioCount", portfolios.size());
        
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/user/{userId}/all-positions")
    public ResponseEntity<List<Map<String, Object>>> getAllUserPositions(@PathVariable Long userId) {
        User user = userService.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        List<Portfolio> portfolios = portfolioService.findByUser(user);
        List<Map<String, Object>> allPositions = new ArrayList<>();

        for (Portfolio portfolio : portfolios) {
            List<PortfolioPosition> positions = positionService.findByPortfolio(portfolio);
            
            for (PortfolioPosition position : positions) {
                Map<String, Object> positionData = new HashMap<>();
                positionData.put("id", position.getId());
                positionData.put("portfolioId", portfolio.getId());
                positionData.put("portfolioName", portfolio.getName());
                positionData.put("symbol", position.getAsset().getSymbol());
                positionData.put("name", position.getAsset().getName());
                positionData.put("assetType", position.getAsset().getAssetType());
                positionData.put("quantity", position.getQuantity());
                positionData.put("averageBuyPrice", position.getAverageBuyPrice());
                positionData.put("updatedAt", position.getUpdatedAt());
                
                BigDecimal currentPrice = marketDataService.getCurrentPrice(position.getAsset().getSymbol());

                if (currentPrice.compareTo(BigDecimal.ZERO) <= 0) {
                    currentPrice = position.getAverageBuyPrice();
                }

                positionData.put("currentPrice", currentPrice);

                allPositions.add(positionData);
            }
        }
        return ResponseEntity.ok(allPositions);
    }
}