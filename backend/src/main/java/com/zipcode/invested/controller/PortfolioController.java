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
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolios")
@CrossOrigin(origins = "http://localhost:5173")
public class PortfolioController {

    private final PortfolioService portfolioService;
    private final UserService userService;
    private final PortfolioPositionService positionService;
    private final FinnhubService finnhubService;
    private final ObjectMapper objectMapper;

    public PortfolioController(PortfolioService portfolioService, 
                              UserService userService,
                              PortfolioPositionService positionService,
                              FinnhubService finnhubService) {
        this.portfolioService = portfolioService;
        this.userService = userService;
        this.positionService = positionService;
        this.finnhubService = finnhubService;
        this.objectMapper = new ObjectMapper();
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
            PortfolioPosition position = portfolioService.executeBuy(portfolioId, buyRequest);
            return ResponseEntity.ok(position);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get user's total portfolio summary (combined across all portfolios)
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
            
            // Calculate portfolio value with real-time prices from Finnhub
            for (PortfolioPosition position : positions) {
                try {
                    // Fetch current price from Finnhub
                    String quoteJson = finnhubService.getQuote(position.getAsset().getSymbol());
                    JsonNode quoteNode = objectMapper.readTree(quoteJson);
                    BigDecimal currentPrice = BigDecimal.valueOf(quoteNode.get("c").asDouble());
                    
                    // Calculate position value
                    BigDecimal positionValue = position.getQuantity().multiply(currentPrice);
                    totalValue = totalValue.add(positionValue);
                    
                    // Calculate cost basis
                    BigDecimal costBasis = position.getQuantity().multiply(position.getAverageBuyPrice());
                    totalCostBasis = totalCostBasis.add(costBasis);
                } catch (Exception e) {
                    System.err.println("Error fetching price for " + position.getAsset().getSymbol() + ": " + e.getMessage());
                    // Fallback to average buy price if API fails
                    BigDecimal fallbackValue = position.getQuantity().multiply(position.getAverageBuyPrice());
                    totalValue = totalValue.add(fallbackValue);
                    totalCostBasis = totalCostBasis.add(fallbackValue);
                }
            }
        }
        
        totalValue = totalValue.add(totalCash); // Total value includes cash
        totalCostBasis = totalCostBasis.add(totalCash); // Cost basis includes initial cash
        
        BigDecimal totalGainLoss = totalValue.subtract(totalCostBasis);
        BigDecimal totalGainLossPercent = BigDecimal.ZERO;
        if (totalCostBasis.compareTo(BigDecimal.ZERO) > 0) {
            totalGainLossPercent = totalGainLoss.divide(totalCostBasis, 4, BigDecimal.ROUND_HALF_UP)
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

    // Get all positions across all user's portfolios with real-time prices
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
                
                // Fetch real-time current price from Finnhub
                try {
                    String quoteJson = finnhubService.getQuote(position.getAsset().getSymbol());
                    JsonNode quoteNode = objectMapper.readTree(quoteJson);
                    double currentPrice = quoteNode.get("c").asDouble();
                    positionData.put("currentPrice", currentPrice);
                } catch (Exception e) {
                    System.err.println("Error fetching price for " + position.getAsset().getSymbol() + ": " + e.getMessage());
                    // Fallback to average buy price
                    positionData.put("currentPrice", position.getAverageBuyPrice().doubleValue());
                }
                
                allPositions.add(positionData);
            }
        }
        
        return ResponseEntity.ok(allPositions);
    }
}