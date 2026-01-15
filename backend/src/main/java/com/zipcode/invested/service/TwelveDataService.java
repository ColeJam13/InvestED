package com.zipcode.invested.service;

import com.zipcode.invested.config.TwelveDataConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.cache.annotation.Cacheable;

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

    @Cacheable(value = "twelveHistorical", key = "#symbol + '_' + #interval + '_' + #outputsize", unless = "#result == null")
    public String getHistoricalData(String symbol, String interval, int outputsize) {
        String url = UriComponentsBuilder
                .fromUriString(config.getBaseUrl() + "/time_series")
                .queryParam("symbol", symbol)
                .queryParam("interval", interval)
                .queryParam("outputsize", outputsize)
                .queryParam("apikey", config.getApiKey())
                .toUriString();
        
        System.out.println("Fetching historical data from TwelveData for: " + symbol);
        
        try {
            String response = restTemplate.getForObject(url, String.class);
            System.out.println("TwelveData historical response for " + symbol + ": " + response);
            return response;
        } catch (Exception e) {
            System.err.println("Error fetching historical data from TwelveData for " + symbol + ": " + e.getMessage());
            throw e;
        }
    }
}