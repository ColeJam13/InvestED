package com.zipcode.invested.controller;

import com.zipcode.invested.asset.Asset;
import com.zipcode.invested.portfolio.Portfolio;
import com.zipcode.invested.position.PortfolioPosition;
import com.zipcode.invested.service.AssetService;
import com.zipcode.invested.service.PortfolioPositionService;
import com.zipcode.invested.service.PortfolioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/positions")
public class PortfolioPositionController {

    private final PortfolioPositionService positionService;
    private final PortfolioService portfolioService;
    private final AssetService assetService;

    public PortfolioPositionController(
            PortfolioPositionService positionService,
            PortfolioService portfolioService,
            AssetService assetService
    ) {
        this.positionService = positionService;
        this.portfolioService = portfolioService;
        this.assetService = assetService;
    }

    @GetMapping("/portfolio/{portfolioId}")
    public ResponseEntity<List<PortfolioPosition>> getByPortfolio(@PathVariable Long portfolioId) {
        Portfolio portfolio = portfolioService.findById(portfolioId).orElse(null);
        if (portfolio == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(positionService.findByPortfolio(portfolio));
    }

    @PostMapping("/portfolio/{portfolioId}/asset/{assetId}")
    public ResponseEntity<PortfolioPosition> createPosition(
            @PathVariable Long portfolioId,
            @PathVariable Long assetId,
            @RequestBody PortfolioPosition body
    ) {
        Portfolio portfolio = portfolioService.findById(portfolioId).orElse(null);
        if (portfolio == null) return ResponseEntity.notFound().build();

        Asset asset = assetService.findById(assetId).orElse(null);
        if (asset == null) return ResponseEntity.notFound().build();

        body.setPortfolio(portfolio);
        body.setAsset(asset);
        body.setUpdatedAt(Instant.now());

        PortfolioPosition saved = positionService.save(body);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
