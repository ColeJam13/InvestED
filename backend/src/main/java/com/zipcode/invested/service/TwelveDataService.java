package com.zipcode.invested.service;

import com.zipcode.invested.config.TwelveDataConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class TwelveDataService {
    
    @Autowired
    private TwelveDataConfig config;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    public String getStockPrice(String symbol) {
        String url = UriComponentsBuilder
            .fromUriString(config.getBaseUrl() + "/price")
            .queryParam("symbol", symbol)
            .queryParam("apikey", config.getApiKey())
            .toUriString();
        
        return restTemplate.getForObject(url, String.class);
    }
    
    public String getStockQuote(String symbol) {
        String url = UriComponentsBuilder
            .fromUriString(config.getBaseUrl() + "/quote")
            .queryParam("symbol", symbol)
            .queryParam("apikey", config.getApiKey())
            .toUriString();
        
        return restTemplate.getForObject(url, String.class);
    }
    
    public String searchSymbol(String query) {
        String url = UriComponentsBuilder
            .fromUriString(config.getBaseUrl() + "/symbol_search")
            .queryParam("symbol", query)
            .queryParam("apikey", config.getApiKey())
            .toUriString();
        
        return restTemplate.getForObject(url, String.class);
    }
}