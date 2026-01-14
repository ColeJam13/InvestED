package com.zipcode.invested.controller;

import com.zipcode.invested.portfolio.Portfolio;
import com.zipcode.invested.service.PortfolioService;
import com.zipcode.invested.service.PortfolioSnapshotService;
import com.zipcode.invested.snapshot.PortfolioSnapshot;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolio-snapshots")
public class PortfolioSnapshotController {

    private final PortfolioSnapshotService snapshotService;
    private final PortfolioService portfolioService;

    public PortfolioSnapshotController(
            PortfolioSnapshotService snapshotService,
            PortfolioService portfolioService
    ) {
        this.snapshotService = snapshotService;
        this.portfolioService = portfolioService;
    }

    @GetMapping("/portfolio/{portfolioId}")
    public ResponseEntity<List<PortfolioSnapshot>> getByPortfolio(@PathVariable Long portfolioId) {
        Portfolio portfolio = portfolioService.findById(portfolioId).orElse(null);
        if (portfolio == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(snapshotService.findByPortfolio(portfolio));
    }

    @PostMapping("/portfolio/{portfolioId}")
    public ResponseEntity<PortfolioSnapshot> createForPortfolio(
            @PathVariable Long portfolioId,
            @RequestBody PortfolioSnapshot body
    ) {
        Portfolio portfolio = portfolioService.findById(portfolioId).orElse(null);
        if (portfolio == null) return ResponseEntity.notFound().build();

        body.setPortfolio(portfolio);
        PortfolioSnapshot saved = snapshotService.save(body);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
