package com.zipcode.invested.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FinnhubConfig {
    
    @Value("${finnhub.api.key}")
    private String apiKey;
    
    public String getApiKey() {
        return apiKey;
    }
    
    public String getBaseUrl() {
        return "https://finnhub.io/api/v1";
    }
}