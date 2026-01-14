package com.zipcode.invested.service;

import com.zipcode.invested.config.FinnhubConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class FinnhubService {
    
    @Autowired
    private FinnhubConfig config;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    // Cache quotes for 60 seconds (60000 milliseconds)
    @Cacheable(value = "quotes", key = "#symbol", unless = "#result == null")
    public String getQuote(String symbol) {
        String url = UriComponentsBuilder
            .fromUriString(config.getBaseUrl() + "/quote")
            .queryParam("symbol", symbol)
            .queryParam("token", config.getApiKey())
            .toUriString();
        
        System.out.println("🔴 Fetching quote from Finnhub API for: " + symbol); // Log when API is actually called
        return restTemplate.getForObject(url, String.class);
    }
    
    // Cache trending quotes for 5 minutes (300000 milliseconds)
    @Cacheable(value = "trending", unless = "#result == null")
    public String getTrendingQuotes() {
        System.out.println("🔴 Fetching trending quotes from Finnhub API"); // Log when API is actually called
        
        // Get quotes for popular symbols
        String[] symbols = {"AAPL", "NVDA", "TSLA", "MSFT", "META"};
        StringBuilder result = new StringBuilder("[");
        
        for (int i = 0; i < symbols.length; i++) {
            String quote = getQuote(symbols[i]);
            result.append(quote);
            if (i < symbols.length - 1) {
                result.append(",");
            }
        }
        result.append("]");
        
        return result.toString();
    }
    
    // Cache search results for 10 minutes (600000 milliseconds)
    @Cacheable(value = "search", key = "#query", unless = "#result == null")
    public String searchSymbol(String query) {
        String url = UriComponentsBuilder
            .fromUriString(config.getBaseUrl() + "/search")
            .queryParam("q", query)
            .queryParam("token", config.getApiKey())
            .toUriString();
        
        System.out.println("🔴 Fetching search results from Finnhub API for: " + query); // Log when API is actually called
        return restTemplate.getForObject(url, String.class);
    }
}