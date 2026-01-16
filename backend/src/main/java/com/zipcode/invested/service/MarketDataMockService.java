package com.zipcode.invested.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

@Service
public class MarketDataMockService {

  
    private static final Map<String, BigDecimal> PRICE_BY_SYMBOL = Map.of(
            "AAPL", new BigDecimal("190.00"),
            "MSFT", new BigDecimal("420.00"),
            "VTI", new BigDecimal("250.00"),
            "BTC", new BigDecimal("45000.00"),
            "ETH", new BigDecimal("2500.00")
    );

    public BigDecimal getCurrentPrice(String symbol) {
        if (symbol == null) return BigDecimal.ZERO;
        return PRICE_BY_SYMBOL.getOrDefault(symbol.toUpperCase(), BigDecimal.ZERO);
    }
}
