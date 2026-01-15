package com.zipcode.invested.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CoinMarketCapConfig {
    
    @Value("${coinmarketcap.api.key}")
    private String apiKey;
    
    @Value("${coinmarketcap.api.base-url:https://pro-api.coinmarketcap.com}")
    private String baseUrl;
    
    public String getApiKey() {
        return apiKey;
    }
    
    public String getBaseUrl() {
        return baseUrl;
    }
}