package com.zipcode.invested.service;

import com.zipcode.invested.asset.Asset;
import com.zipcode.invested.dto.BuyRequest;
import com.zipcode.invested.portfolio.Portfolio;
import com.zipcode.invested.portfolio.PortfolioRepository;
import com.zipcode.invested.position.PortfolioPosition;
import com.zipcode.invested.transaction.Transaction;
import com.zipcode.invested.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final AssetService assetService;
    private final PortfolioPositionService positionService;
    private final TransactionService transactionService;

    public PortfolioService(PortfolioRepository portfolioRepository, 
                           AssetService assetService,
                           PortfolioPositionService positionService,
                           TransactionService transactionService) {
        this.portfolioRepository = portfolioRepository;
        this.assetService = assetService;
        this.positionService = positionService;
        this.transactionService = transactionService;
    }

    public List<Portfolio> findAll() {
        return portfolioRepository.findAll();
    }

    public Optional<Portfolio> findById(Long id) {
        return portfolioRepository.findById(id);
    }

    public List<Portfolio> findByUser(User user) {
        return portfolioRepository.findByUser(user);
    }

    public Portfolio save(Portfolio portfolio) {
        return portfolioRepository.save(portfolio);
    }
    
    @Transactional
    public PortfolioPosition executeBuy(Long portfolioId, BuyRequest buyRequest) {
        Portfolio portfolio = findById(portfolioId)
            .orElseThrow(() -> new RuntimeException("Portfolio not found"));
        
        BigDecimal totalCost = buyRequest.getQuantity().multiply(buyRequest.getCurrentPrice());
        
        if (portfolio.getCashBalance().compareTo(totalCost) < 0) {
            throw new RuntimeException("Insufficient cash balance");
        }
        
        Asset asset = assetService.findBySymbolAndAssetType(
            buyRequest.getSymbol(), 
            buyRequest.getAssetType()
        ).orElseGet(() -> {
            Asset newAsset = new Asset(
                buyRequest.getSymbol(),
                buyRequest.getAssetName(),
                buyRequest.getAssetType()
            );
            return assetService.save(newAsset);
        });
        
        PortfolioPosition position = positionService.findByPortfolioAndAsset(portfolio, asset)
            .orElseGet(() -> new PortfolioPosition(
                portfolio,
                asset,
                BigDecimal.ZERO,
                BigDecimal.ZERO
            ));
        
        BigDecimal oldQuantity = position.getQuantity();
        BigDecimal oldTotalValue = oldQuantity.multiply(position.getAverageBuyPrice());
        BigDecimal newTotalValue = oldTotalValue.add(totalCost);
        BigDecimal newQuantity = oldQuantity.add(buyRequest.getQuantity());
        BigDecimal newAverageCost = newTotalValue.divide(newQuantity, 6, RoundingMode.HALF_UP);
        
        position.setQuantity(newQuantity);
        position.setAverageBuyPrice(newAverageCost);
        position.setUpdatedAt(Instant.now());
        
        PortfolioPosition savedPosition = positionService.save(position);
        
        portfolio.setCashBalance(portfolio.getCashBalance().subtract(totalCost));
        save(portfolio);
        
        Transaction transaction = new Transaction(
            portfolio,
            asset,
            "BUY",
            buyRequest.getQuantity(),
            buyRequest.getCurrentPrice()
        );
        transactionService.save(transaction);
        
        return savedPosition;
    }
}