package com.zipcode.invested.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TwelveDataConfig {
    
    @Value("${twelvedata.api.key}")
    private String apiKey;
    
    @Value("${twelvedata.api.base-url}")
    private String baseUrl;
    
    public String getApiKey() {
        return apiKey;
    }
    
    public String getBaseUrl() {
        return baseUrl;
    }
}