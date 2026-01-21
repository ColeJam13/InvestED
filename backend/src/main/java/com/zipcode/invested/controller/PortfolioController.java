package com.zipcode.invested.controller;

import com.zipcode.invested.portfolio.Portfolio;
import com.zipcode.invested.position.PortfolioPosition;
import com.zipcode.invested.service.PortfolioService;
import com.zipcode.invested.service.UserService;
import com.zipcode.invested.service.PortfolioPositionService;
import com.zipcode.invested.service.FinnhubService;
import com.zipcode.invested.service.MarketDataService;
import com.zipcode.invested.service.CoinMarketCapService;
import com.zipcode.invested.user.User;
import com.zipcode.invested.dto.BuyRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zipcode.invested.dto.PortfolioSummary;
import com.zipcode.invested.service.PortfolioSummaryService;
import com.zipcode.invested.service.TwelveDataService;

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
    private final FinnhubService finnhubService;
    private final ObjectMapper objectMapper;
    private final PortfolioSummaryService portfolioSummaryService;
    private final TwelveDataService twelveDataService;
    private final CoinMarketCapService coinMarketCapService;
    private final MarketDataService marketDataService;


    public PortfolioController(PortfolioService portfolioService, 
                              UserService userService,
                              PortfolioPositionService positionService,
                              FinnhubService finnhubService, 
                              PortfolioSummaryService portfolioSummaryService,
                              TwelveDataService twelveDataService,
                              CoinMarketCapService coinMarketCapService,
                              MarketDataService marketDataService)  {
        this.portfolioService = portfolioService;
        this.userService = userService;
        this.positionService = positionService;
        this.finnhubService = finnhubService;
        this.objectMapper = new ObjectMapper();
        this.portfolioSummaryService = portfolioSummaryService;
        this.twelveDataService = twelveDataService;
        this.coinMarketCapService = coinMarketCapService;
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
        try {
            return ResponseEntity.ok(portfolioSummaryService.buildSummary(id));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
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

    @PostMapping("/{portfolioId}/sell")
    public ResponseEntity<?> executeSell(
            @PathVariable Long portfolioId,
            @RequestBody Map<String, Object> sellRequest) {
        try {
            Long positionId = Long.valueOf(sellRequest.get("positionId").toString());
            BigDecimal quantity = new BigDecimal(sellRequest.get("quantity").toString());
            BigDecimal currentPrice = new BigDecimal(sellRequest.get("currentPrice").toString());
            
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
                try {
                    String symbol = position.getAsset().getSymbol();
                    BigDecimal currentPrice = marketDataService.getCurrentPrice(symbol);
                    
                    BigDecimal positionValue = position.getQuantity().multiply(currentPrice);
                    totalValue = totalValue.add(positionValue);
                    
                    BigDecimal costBasis = position.getQuantity().multiply(position.getAverageBuyPrice());
                    totalCostBasis = totalCostBasis.add(costBasis);
                } catch (Exception e) {
                    System.err.println("Error fetching price for " + position.getAsset().getSymbol() + ": " + e.getMessage());
                    BigDecimal fallbackValue = position.getQuantity().multiply(position.getAverageBuyPrice());
                    totalValue = totalValue.add(fallbackValue);
                    totalCostBasis = totalCostBasis.add(fallbackValue);
                }
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
                
                try {
                    BigDecimal currentPrice = marketDataService.getCurrentPrice(position.getAsset().getSymbol());
                    positionData.put("currentPrice", currentPrice.doubleValue());
                } catch (Exception e) {
                    System.err.println("Error fetching price for " + position.getAsset().getSymbol() + ": " + e.getMessage());
                    positionData.put("currentPrice", position.getAverageBuyPrice().doubleValue());
                }
                
                allPositions.add(positionData);
            }
        }
        
        return ResponseEntity.ok(allPositions);
    }

    @GetMapping("/user/{userId}/performance/historical")
    public ResponseEntity<?> getHistoricalPerformance(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "1M") String range,
            @RequestParam(defaultValue = "all") String assetFilter) {
        try {
            User user = userService.findById(userId).orElse(null);
            if (user == null) return ResponseEntity.notFound().build();

            long endTimestamp = System.currentTimeMillis() / 1000; 
            long startTimestamp;
            int dataPoints;
            
            switch (range.toUpperCase()) {
                case "1D":
                    startTimestamp = endTimestamp - (24 * 60 * 60);
                    dataPoints = 24; 
                    break;
                case "1W":
                    startTimestamp = endTimestamp - (7 * 24 * 60 * 60); // 1 week ago
                    dataPoints = 7; // Daily for 1 week
                    break;
                case "1M":
                    startTimestamp = endTimestamp - (30 * 24 * 60 * 60); // 1 month ago
                    dataPoints = 30; // Daily for 1 month
                    break;
                case "3M":
                    startTimestamp = endTimestamp - (90 * 24 * 60 * 60); // 3 months ago
                    dataPoints = 90; // Daily for 3 months
                    break;
                case "1Y":
                    startTimestamp = endTimestamp - (365 * 24 * 60 * 60); // 1 year ago
                    dataPoints = 365; // Daily for 1 year
                    break;
                default:
                    startTimestamp = endTimestamp - (30 * 24 * 60 * 60);
                    dataPoints = 30;
            }
            
            // Get user's portfolios and positions
            List<Portfolio> portfolios = portfolioService.findByUser(user);
            List<PortfolioPosition> allPositions = new ArrayList<>();
            BigDecimal totalCash = BigDecimal.ZERO;
            
            for (Portfolio portfolio : portfolios) {
                allPositions.addAll(positionService.findByPortfolio(portfolio));
                totalCash = totalCash.add(portfolio.getCashBalance());
            }

            if (!"all".equals(assetFilter)) {
                allPositions = allPositions.stream()
                        .filter(pos -> {
                            String assetType = pos.getAsset().getAssetType();
                            if ("stocks".equals(assetFilter)) {
                                return "STOCK".equalsIgnoreCase(assetType);
                            } else if ("crypto".equals(assetFilter)) {
                                return "CRYPTO".equalsIgnoreCase(assetType);
                            }
                            return true;
                        })
                        .collect(java.util.stream.Collectors.toList());
            }

            
            if (allPositions.isEmpty()) {
                // Return flat line at current cash balance if no positions
                return ResponseEntity.ok(generateFlatPerformance(totalCash, dataPoints, startTimestamp, endTimestamp));
            }
            
            // Calculate historical performance
            Map<String, Object> performance = calculateHistoricalPerformance(
                    allPositions, totalCash, startTimestamp, endTimestamp, dataPoints, range);
            
            return ResponseEntity.ok(performance);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch historical performance: " + e.getMessage()));
        }
    }

    private Map<String, Object> generateFlatPerformance(BigDecimal value, int dataPoints, long startTimestamp, long endTimestamp) {
        List<Map<String, Object>> data = new ArrayList<>();
        double val = value.doubleValue();
        long timeStep = (endTimestamp - startTimestamp) / dataPoints;
        
        for (int i = 0; i < dataPoints; i++) {
            Map<String, Object> point = new HashMap<>();
            point.put("timestamp", startTimestamp + (i * timeStep));
            point.put("value", val);
            data.add(point);
        }
        
        return Map.of(
            "data", data, 
            "currentValue", val, 
            "startValue", val,
            "change", 0, 
            "changePercent", 0
        );
    }

    private Map<String, Object> calculateHistoricalPerformance(
            List<PortfolioPosition> positions, 
            BigDecimal totalCash,
            long startTimestamp, 
            long endTimestamp, 
            int dataPoints,
            String range) throws Exception {
        
        // Calculate current value of each position to find top holdings
        List<PortfolioPosition> sortedPositions = new ArrayList<>(positions);
        sortedPositions.sort((p1, p2) -> {
            try {
                String symbol1 = p1.getAsset().getSymbol();
                String symbol2 = p2.getAsset().getSymbol();
                BigDecimal value1;
                BigDecimal value2;
                
                // Get price for position 1
                if (symbol1.startsWith("CRYPTO:")) {
                    String cryptoSymbol1 = symbol1.replace("CRYPTO:", "");
                    String cryptoQuote1 = coinMarketCapService.getCryptoQuote(cryptoSymbol1);
                    JsonNode cryptoNode1 = objectMapper.readTree(cryptoQuote1);
                    value1 = p1.getQuantity().multiply(
                        BigDecimal.valueOf(cryptoNode1.get("data").get(cryptoSymbol1).get("quote").get("USD").get("price").asDouble())
                    );
                } else {
                    String quote1 = finnhubService.getQuote(symbol1);
                    JsonNode node1 = objectMapper.readTree(quote1);
                    value1 = p1.getQuantity().multiply(BigDecimal.valueOf(node1.get("c").asDouble()));
                }
                
                // Get price for position 2
                if (symbol2.startsWith("CRYPTO:")) {
                    String cryptoSymbol2 = symbol2.replace("CRYPTO:", "");
                    String cryptoQuote2 = coinMarketCapService.getCryptoQuote(cryptoSymbol2);
                    JsonNode cryptoNode2 = objectMapper.readTree(cryptoQuote2);
                    value2 = p2.getQuantity().multiply(
                        BigDecimal.valueOf(cryptoNode2.get("data").get(cryptoSymbol2).get("quote").get("USD").get("price").asDouble())
                    );
                } else {
                    String quote2 = finnhubService.getQuote(symbol2);
                    JsonNode node2 = objectMapper.readTree(quote2);
                    value2 = p2.getQuantity().multiply(BigDecimal.valueOf(node2.get("c").asDouble()));
                }
                
                return value2.compareTo(value1); // Descending order
            } catch (Exception e) {
                return 0;
            }
        });
        
        // Take only top 5 positions to stay under API rate limits
        List<PortfolioPosition> topPositions = sortedPositions.stream()
                .limit(5)
                .collect(java.util.stream.Collectors.toList());
        
        System.out.println("Using top " + topPositions.size() + " positions for historical data");
        
        // Determine interval and outputsize based on range
        String interval;
        int outputsize;
        
        switch (range.toUpperCase()) {
            case "1D":
            case "LIVE":
                interval = "1h";
                outputsize = 24;
                break;
            case "1W":
                interval = "1day";
                outputsize = 7;
                break;
            case "1M":
                interval = "1day";
                outputsize = 30;
                break;
            case "3M":
                interval = "1day";
                outputsize = 90;
                break;
            case "1Y":
            case "ALL":
                interval = "1day";
                outputsize = 365;
                break;
            default:
                interval = "1day";
                outputsize = 30;
        }
        
        // Fetch historical data for top positions with delay between calls
        Map<String, JsonNode> historicalDataMap = new HashMap<>();
            
        for (PortfolioPosition position : topPositions) {
            String symbol = position.getAsset().getSymbol();
            System.out.println("===> Processing position for historical data: " + symbol);
            
            try {
                String histData;
                
                if (symbol.startsWith("CRYPTO:")) {
                    // Handle crypto - convert CRYPTO:ETH to ETH/USD for TwelveData
                    String cryptoSymbol = symbol.replace("CRYPTO:", "") + "/USD";
                    histData = twelveDataService.getHistoricalData(cryptoSymbol, interval, outputsize);
                } else {
                    // Handle stocks
                    histData = twelveDataService.getHistoricalData(symbol, interval, outputsize);
                }
                
                JsonNode histNode = objectMapper.readTree(histData);
                
                // Check if we got valid data
                if (histNode.has("values") && histNode.get("values").isArray()) {
                    historicalDataMap.put(symbol, histNode);
                    System.out.println("Successfully fetched historical data for " + symbol);
                } else if (histNode.has("status") && "error".equals(histNode.get("status").asText())) {
                    System.err.println("TwelveData error for " + symbol + ": " + histNode.get("message").asText());
                }
                
                // Only sleep if this is not the last position
                if (topPositions.indexOf(position) < topPositions.size() - 1) {
                    Thread.sleep(2000);
                }
                
            } catch (Exception e) {
                System.err.println("Error fetching historical data for " + symbol + ": " + e.getMessage());
            }
        }
        
        // Build time series data
        List<Map<String, Object>> timeSeriesData = new ArrayList<>();
        
        // TwelveData returns newest first, so we need to reverse
        int actualDataPoints = outputsize;
        for (int i = actualDataPoints - 1; i >= 0; i--) {
            BigDecimal portfolioValue = totalCash; // Start with cash
            
            // Add up position values at this point in time
            for (PortfolioPosition position : topPositions) {
                String symbol = position.getAsset().getSymbol();
                
                JsonNode histData = historicalDataMap.get(symbol);
                if (histData != null && histData.has("values")) {
                    JsonNode values = histData.get("values");
                    
                    if (values.isArray() && i < values.size()) {
                        JsonNode dataPoint = values.get(i);
                        double historicalPrice = dataPoint.get("close").asDouble();
                        BigDecimal positionValue = position.getQuantity()
                                .multiply(BigDecimal.valueOf(historicalPrice));
                        portfolioValue = portfolioValue.add(positionValue);
                    }
                }
            }
            
            // For positions not in top 5, use current price (flat line)
            for (PortfolioPosition position : positions) {
                if (!topPositions.contains(position)) {
                    BigDecimal positionValue = position.getQuantity()
                            .multiply(position.getAverageBuyPrice());
                    portfolioValue = portfolioValue.add(positionValue);
                }
            }
            
            Map<String, Object> point = new HashMap<>();
            // Use index as timestamp placeholder (will be properly formatted on frontend)
            point.put("timestamp", startTimestamp + ((actualDataPoints - 1 - i) * (endTimestamp - startTimestamp) / actualDataPoints));
            point.put("value", portfolioValue.doubleValue());
            timeSeriesData.add(point);
        }
        
        // Calculate metrics
        double startValue = timeSeriesData.isEmpty() ? 0 : (double) timeSeriesData.get(0).get("value");
        double endValue = timeSeriesData.isEmpty() ? 0 : (double) timeSeriesData.get(timeSeriesData.size() - 1).get("value");
        double change = endValue - startValue;
        double changePercent = startValue > 0 ? (change / startValue) * 100 : 0;
        
        Map<String, Object> result = new HashMap<>();
        result.put("data", timeSeriesData);
        result.put("currentValue", endValue);
        result.put("startValue", startValue);
        result.put("change", change);
        result.put("changePercent", changePercent);
        result.put("range", range);
        
        return result;
    }
}