package com.zipcode.invested.controller;

import com.zipcode.invested.portfolio.Portfolio;
import com.zipcode.invested.service.PortfolioService;
import com.zipcode.invested.service.PortfolioSnapshotService;
import com.zipcode.invested.service.UserService;
import com.zipcode.invested.service.PortfolioPositionService;
import com.zipcode.invested.service.FinnhubService;
import com.zipcode.invested.snapshot.PortfolioSnapshot;
import com.zipcode.invested.user.User;
import com.zipcode.invested.position.PortfolioPosition;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/portfolio-snapshots")
public class PortfolioSnapshotController {

    private final PortfolioSnapshotService snapshotService;
    private final PortfolioService portfolioService;
    private final UserService userService;
    private final PortfolioPositionService positionService;
    private final FinnhubService finnhubService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public PortfolioSnapshotController(
            PortfolioSnapshotService snapshotService,
            PortfolioService portfolioService,
            UserService userService,
            PortfolioPositionService positionService,
            FinnhubService finnhubService
    ) {
        this.snapshotService = snapshotService;
        this.portfolioService = portfolioService;
        this.userService = userService;
        this.positionService = positionService;
        this.finnhubService = finnhubService;
    }

    @GetMapping("/portfolio/{portfolioId}")
    public ResponseEntity<List<PortfolioSnapshot>> getByPortfolio(@PathVariable Long portfolioId) {
        Portfolio portfolio = portfolioService.findById(portfolioId).orElse(null);
        if (portfolio == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(snapshotService.findByPortfolio(portfolio));
    }

    @PostMapping("/portfolio/{portfolioId}")
    public ResponseEntity<PortfolioSnapshot> createForPortfolio(
            @PathVariable Long portfolioId,
            @RequestBody PortfolioSnapshot body
    ) {
        Portfolio portfolio = portfolioService.findById(portfolioId).orElse(null);
        if (portfolio == null) return ResponseEntity.notFound().build();
        body.setPortfolio(portfolio);
        PortfolioSnapshot saved = snapshotService.save(body);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/user/{userId}/chart-data")
    public ResponseEntity<List<Map<String, Object>>> getChartData(@PathVariable Long userId) {
        User user = userService.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        
        List<Portfolio> portfolios = portfolioService.findByUser(user);
        
        // Calculate current total value
        BigDecimal totalValue = BigDecimal.ZERO;
        for (Portfolio portfolio : portfolios) {
            totalValue = totalValue.add(portfolio.getCashBalance());
            List<PortfolioPosition> positions = positionService.findByPortfolio(portfolio);
            for (PortfolioPosition position : positions) {
                try {
                    String quoteJson = finnhubService.getQuote(position.getAsset().getSymbol());
                    JsonNode quoteNode = objectMapper.readTree(quoteJson);
                    BigDecimal currentPrice = BigDecimal.valueOf(quoteNode.get("c").asDouble());
                    BigDecimal positionValue = position.getQuantity().multiply(currentPrice);
                    totalValue = totalValue.add(positionValue);
                } catch (Exception e) {
                    BigDecimal fallbackValue = position.getQuantity().multiply(position.getAverageBuyPrice());
                    totalValue = totalValue.add(fallbackValue);
                }
            }
        }
        
        // Generate 24 hours of mock data with realistic variation
        List<Map<String, Object>> chartData = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        Random random = new Random(42); // Fixed seed for consistent demo data
        
        for (int i = 23; i >= 0; i--) {
            LocalDateTime timestamp = now.minusHours(i);
            
            // Add small random variation (±2% max)
            double variation = 1.0 + (random.nextDouble() - 0.5) * 0.04; // -2% to +2%
            BigDecimal variedValue = totalValue.multiply(BigDecimal.valueOf(variation));
            
            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("timestamp", timestamp.toString());
            dataPoint.put("value", variedValue.doubleValue());
            chartData.add(dataPoint);
        }
        
        return ResponseEntity.ok(chartData);
    }
}