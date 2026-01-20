package com.zipcode.invested.controller;

import com.zipcode.invested.service.TransactionService;
import com.zipcode.invested.transaction.Transaction;
import com.zipcode.invested.portfolio.Portfolio;
import com.zipcode.invested.portfolio.PortfolioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {

    private final TransactionService transactionService;
    private final PortfolioRepository portfolioRepository;

    public TransactionController(TransactionService transactionService, PortfolioRepository portfolioRepository) {
        this.transactionService = transactionService;
        this.portfolioRepository = portfolioRepository;
    }

    @GetMapping("/portfolio/{portfolioId}")
    public ResponseEntity<List<Transaction>> getTransactionsByPortfolio(@PathVariable Long portfolioId) {
        Portfolio portfolio = portfolioRepository.findById(portfolioId).orElse(null);
        if (portfolio == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(transactionService.findByPortfolio(portfolio));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Transaction>> getTransactionsByUser(@PathVariable Long userId) {
        List<Portfolio> portfolios = portfolioRepository.findAll().stream()
            .filter(p -> p.getUser().getId().equals(userId))
            .toList();
        
        List<Transaction> allTransactions = portfolios.stream()
            .flatMap(p -> transactionService.findByPortfolio(p).stream())
            .sorted((a, b) -> b.getTransactionDate().compareTo(a.getTransactionDate()))
            .toList();
        
        return ResponseEntity.ok(allTransactions);
    }
}
