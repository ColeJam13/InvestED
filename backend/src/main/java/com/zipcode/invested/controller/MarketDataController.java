package com.zipcode.invested.controller;

import com.zipcode.invested.service.TwelveDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/market")
@CrossOrigin(origins = "*")
public class MarketDataController {
    
    @Autowired
    private TwelveDataService twelveDataService;
    
    @GetMapping("/price/{symbol}")
    public String getPrice(@PathVariable String symbol) {
        return twelveDataService.getStockPrice(symbol);
    }
    
    @GetMapping("/quote/{symbol}")
    public String getQuote(@PathVariable String symbol) {
        return twelveDataService.getStockQuote(symbol);
    }
    
    @GetMapping("/search")
    public String searchSymbol(@RequestParam String query) {
        return twelveDataService.searchSymbol(query);
    }
}