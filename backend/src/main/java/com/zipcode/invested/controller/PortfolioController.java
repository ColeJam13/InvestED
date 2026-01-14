package com.zipcode.invested.controller;

import com.zipcode.invested.dto.BuyRequest;
import com.zipcode.invested.portfolio.Portfolio;
import com.zipcode.invested.position.PortfolioPosition;
import com.zipcode.invested.service.PortfolioService;
import com.zipcode.invested.service.UserService;
import com.zipcode.invested.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolios")
@CrossOrigin(origins = "http://localhost:5173")
public class PortfolioController {

    private final PortfolioService portfolioService;
    private final UserService userService;

    public PortfolioController(PortfolioService portfolioService, UserService userService) {
        this.portfolioService = portfolioService;
        this.userService = userService;
    }

    @GetMapping
    public List<Portfolio> getAll() {
        return portfolioService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Portfolio> getById(@PathVariable Long id) {
        return portfolioService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Portfolio>> getByUser(@PathVariable Long userId) {
        User user = userService.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(portfolioService.findByUser(user));
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<Portfolio> createForUser(@PathVariable Long userId, @RequestBody Portfolio body) {
        User user = userService.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        body.setUser(user);
        Portfolio saved = portfolioService.save(body);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
    
    // NEW ENDPOINT - Buy asset
    @PostMapping("/{portfolioId}/buy")
    public ResponseEntity<?> buyAsset(
            @PathVariable Long portfolioId,
            @RequestBody BuyRequest buyRequest
    ) {
        try {
            PortfolioPosition position = portfolioService.executeBuy(portfolioId, buyRequest);
            return ResponseEntity.ok(position);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}