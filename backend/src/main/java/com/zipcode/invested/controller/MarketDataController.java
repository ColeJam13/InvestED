package com.zipcode.invested.controller;

import com.zipcode.invested.service.FinnhubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/market")
@CrossOrigin(origins = "http://localhost:5173")
public class MarketDataController {
    
    @Autowired
    private FinnhubService finnhubService;
    
    @GetMapping("/quote")
    public String getQuote(@RequestParam String symbol) {
        return finnhubService.getQuote(symbol);
    }
    
    @GetMapping("/search")
    public String searchSymbol(@RequestParam String query) {
        return finnhubService.searchSymbol(query);
    }
    
    @GetMapping("/trending")
    public String getTrending() {
        return finnhubService.getTrendingQuotes();
    }
}