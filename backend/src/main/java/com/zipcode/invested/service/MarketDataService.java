package com.zipcode.invested.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MarketDataService {

    private final FinnhubService finnhubService;
    private final CoinMarketCapService coinMarketCapService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final long CACHE_TTL_SECONDS = 30;

    private static class CachedPrice {
        final BigDecimal price;
        final Instant expiresAt;

        CachedPrice(BigDecimal price, Instant expiresAt) {
            this.price = price;
            this.expiresAt = expiresAt;
        }
    }

    private final ConcurrentHashMap<String, CachedPrice> priceCache = new ConcurrentHashMap<>();

    public MarketDataService(FinnhubService finnhubService, CoinMarketCapService coinMarketCapService) {
        this.finnhubService = finnhubService;
        this.coinMarketCapService = coinMarketCapService;
    }

   
    public BigDecimal getCurrentPrice(String symbol) {
        if (symbol == null || symbol.isBlank()) {
            throw new IllegalArgumentException("symbol is required");
        }

        String normalized = symbol.trim();
        String cacheKey = normalized.toUpperCase();

        CachedPrice cached = priceCache.get(cacheKey);
        if (cached != null && Instant.now().isBefore(cached.expiresAt)) {
            return cached.price;
        }

        try {
            if (normalized.startsWith("CRYPTO:")) {
                String cryptoSymbol = normalized.substring(7).toUpperCase(); // BTC, ETH, etc.
                String cryptoQuoteJson = coinMarketCapService.getCryptoQuote(cryptoSymbol);

                JsonNode cmcData = objectMapper.readTree(cryptoQuoteJson);
                JsonNode cryptoData = cmcData.path("data").path(cryptoSymbol).get(0);
                JsonNode quoteUsd = cryptoData.path("quote").path("USD");
                double price = quoteUsd.path("price").asDouble(0.0);

                if (price <= 0.0) {
                    throw new IllegalArgumentException("Invalid price returned for symbol: " + normalized);
                }

                BigDecimal bdPrice = BigDecimal.valueOf(price);
                priceCache.put(cacheKey, new CachedPrice(bdPrice, Instant.now().plusSeconds(CACHE_TTL_SECONDS)));
                return bdPrice;
            }

            String quoteJson = finnhubService.getQuote(cacheKey);
            JsonNode quoteNode = objectMapper.readTree(quoteJson);

            double current = quoteNode.path("c").asDouble(0.0);

            if (current <= 0.0) {
                throw new IllegalArgumentException("Invalid price returned for symbol: " + normalized);
            }

            BigDecimal bdPrice = BigDecimal.valueOf(current);
            priceCache.put(cacheKey, new CachedPrice(bdPrice, Instant.now().plusSeconds(CACHE_TTL_SECONDS)));
            return bdPrice;

        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to fetch current price for symbol: " + normalized);
        }
    }
}
