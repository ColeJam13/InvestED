package com.zipcode.invested.service;

import com.zipcode.invested.config.CoinMarketCapConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.http.ResponseEntity;

@Service
public class CoinMarketCapService {

    @Autowired
    private CoinMarketCapConfig config;

    private final RestTemplate restTemplate = new RestTemplate();

    @Cacheable(value = "cryptoQuote", key = "#symbol")
    public String getCryptoQuote(String symbol) {
        String url = UriComponentsBuilder
                .fromUriString(config.getBaseUrl() + "/v2/cryptocurrency/quotes/latest")
                .queryParam("symbol", symbol)
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-CMC_PRO_API_KEY", config.getApiKey());
        headers.set("Accept", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        System.out.println("Fetching crypto quote from CoinMarketCap for: " + symbol);
        String response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class).getBody();
        return response;
    }

    @Cacheable(value = "cryptoSearch", key = "#query")
    public String searchCrypto(String query) {
        String url = UriComponentsBuilder
                .fromUriString(config.getBaseUrl() + "/v1/cryptocurrency/map")
                .queryParam("symbol", query)
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-CMC_PRO_API_KEY", config.getApiKey());
        headers.set("Accept", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        System.out.println("Searching crypto on CoinMarketCap for: " + query);
        String response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class).getBody();
        System.out.println("CoinMarketCap response: " + response); // ADD THIS LINE
        return response;
    }

    @Cacheable(value = "cryptoHistorical", key = "#symbol + '_' + #fromDate + '_' + #toDate", unless = "#result == null")
    public String getCryptoHistoricalData(String symbol, String fromDate, String toDate) {
        String url = UriComponentsBuilder
                .fromUriString(config.getBaseUrl() + "/v2/cryptocurrency/quotes/historical")
                .queryParam("symbol", symbol)
                .queryParam("time_start", fromDate)
                .queryParam("time_end", toDate)
                .queryParam("interval", "daily")
                .toUriString();
        
        System.out.println("Fetching historical crypto data from CoinMarketCap for: " + symbol);
        
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-CMC_PRO_API_KEY", config.getApiKey());
        HttpEntity<String> entity = new HttpEntity<>(headers);
        
        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            System.out.println("Historical crypto data response for " + symbol + ": " + response.getBody());
            return response.getBody();
        } catch (Exception e) {
            System.err.println("Error fetching historical crypto data for " + symbol + ": " + e.getMessage());
            throw e;
        }
    }
}