package com.zipcode.invested.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cache.caffeine.CaffeineCache;
import com.github.benmanes.caffeine.cache.Caffeine;

import java.util.Arrays;
import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager() {
        SimpleCacheManager cacheManager = new SimpleCacheManager();
        
        CaffeineCache quotesCache = buildCache("quotes", 1, TimeUnit.MINUTES);
        CaffeineCache searchCache = buildCache("search", 1, TimeUnit.MINUTES);
        CaffeineCache trendingCache = buildCache("trending", 1, TimeUnit.MINUTES);
        CaffeineCache cryptoQuoteCache = buildCache("cryptoQuote", 1, TimeUnit.MINUTES);
        CaffeineCache cryptoSearchCache = buildCache("cryptoSearch", 1, TimeUnit.MINUTES);
        
        CaffeineCache historicalCache = buildCache("twelveHistorical", 24, TimeUnit.HOURS);
        CaffeineCache cryptoHistoricalCache = buildCache("cryptoHistorical", 24, TimeUnit.HOURS);
        
        cacheManager.setCaches(Arrays.asList(
            quotesCache, searchCache, trendingCache, 
            cryptoQuoteCache, cryptoSearchCache,
            historicalCache, cryptoHistoricalCache
        ));
        
        return cacheManager;
    }
    
    private CaffeineCache buildCache(String name, long duration, TimeUnit timeUnit) {
        return new CaffeineCache(name, Caffeine.newBuilder()
            .expireAfterWrite(duration, timeUnit)
            .maximumSize(1000)
            .recordStats()
            .build());
    }
}