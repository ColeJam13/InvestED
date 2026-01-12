package com.zipcode.invested.service;

import com.zipcode.invested.config.FinnhubConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class FinnhubService {
    
    @Autowired
    private FinnhubConfig config;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    public String getQuote(String symbol) {
        String url = UriComponentsBuilder
            .fromUriString(config.getBaseUrl() + "/quote")
            .queryParam("symbol", symbol)
            .queryParam("token", config.getApiKey())
            .toUriString();
        
        return restTemplate.getForObject(url, String.class);
    }
    
    public String getTrendingQuotes() {
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
}