package com.zipcode.invested.controller;

import com.zipcode.invested.service.TwelveDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/market")
@CrossOrigin(origins = "http://localhost:5173")
public class MarketDataController {
    
    @Autowired
    private TwelveDataService twelveDataService;
    
    @GetMapping("/price/{symbol}")
    public String getPrice(@PathVariable String symbol) {
        return twelveDataService.getStockPrice(symbol);
    }
    
    @GetMapping("/quote")
    public String getQuote(@RequestParam String symbol) {
        return twelveDataService.getStockQuote(symbol);
    }
    
    @GetMapping("/search")
    public String searchSymbol(@RequestParam String query) {
        return twelveDataService.searchSymbol(query);
    }
}