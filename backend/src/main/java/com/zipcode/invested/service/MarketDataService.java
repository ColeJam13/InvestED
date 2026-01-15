package com.zipcode.invested.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class MarketDataService {

    private final FinnhubService finnhubService;
    private final CoinMarketCapService coinMarketCapService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public MarketDataService(FinnhubService finnhubService, CoinMarketCapService coinMarketCapService) {
        this.finnhubService = finnhubService;
        this.coinMarketCapService = coinMarketCapService;
    }

    /**
     * Returns current price for either:
     * - stock symbol: "AAPL"
     * - crypto symbol: "CRYPTO:BTC"
     */
    public BigDecimal getCurrentPrice(String symbol) {
        if (symbol == null || symbol.isBlank()) return BigDecimal.ZERO;

        String normalized = symbol.trim();

        try {
            if (normalized.startsWith("CRYPTO:")) {
                String cryptoSymbol = normalized.substring(7).toUpperCase(); // BTC, ETH, etc.
                String cryptoQuoteJson = coinMarketCapService.getCryptoQuote(cryptoSymbol);

                JsonNode cmcData = objectMapper.readTree(cryptoQuoteJson);
                JsonNode cryptoData = cmcData.path("data").path(cryptoSymbol).get(0);
                JsonNode quoteUsd = cryptoData.path("quote").path("USD");
                double price = quoteUsd.path("price").asDouble(0.0);

                return BigDecimal.valueOf(price);
            }

            // Stock quote from Finnhub
            String quoteJson = finnhubService.getQuote(normalized.toUpperCase());
            JsonNode quoteNode = objectMapper.readTree(quoteJson);

            // Finnhub format: { "c": current, "h": high, "l": low, "o": open, "pc": prevClose, ... }
            double current = quoteNode.path("c").asDouble(0.0);
            return BigDecimal.valueOf(current);

        } catch (Exception e) {
            // Fail-safe: return 0 if external API fails
            return BigDecimal.ZERO;
        }
    }
}
