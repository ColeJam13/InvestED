package com.zipcode.invested.service;

import com.zipcode.invested.asset.Asset;
import com.zipcode.invested.asset.AssetRepository;
import com.zipcode.invested.dto.BuyRequest;
import com.zipcode.invested.portfolio.Portfolio;
import com.zipcode.invested.portfolio.PortfolioRepository;
import com.zipcode.invested.position.PortfolioPosition;
import com.zipcode.invested.position.PortfolioPositionRepository;
import com.zipcode.invested.transaction.Transaction;
import com.zipcode.invested.transaction.TransactionRepository;
import com.zipcode.invested.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.RoundingMode;


import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final AssetRepository assetRepository;
    private final PortfolioPositionRepository positionRepository;
    private final TransactionRepository transactionRepository;

    public PortfolioService(PortfolioRepository portfolioRepository,
                           AssetRepository assetRepository,
                           PortfolioPositionRepository positionRepository,
                           TransactionRepository transactionRepository) {
        this.portfolioRepository = portfolioRepository;
        this.assetRepository = assetRepository;
        this.positionRepository = positionRepository;
        this.transactionRepository = transactionRepository;
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
        // 1. Validate portfolio exists
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found"));

        // 2. Calculate total cost
        BigDecimal totalCost = buyRequest.getCurrentPrice().multiply(buyRequest.getQuantity());

        // 3. Validate sufficient cash balance
        if (portfolio.getCashBalance().compareTo(totalCost) < 0) {
            throw new IllegalArgumentException("Insufficient funds. Available: " + portfolio.getCashBalance() + ", Required: " + totalCost);
        }

        // 4. Get or create Asset
        Optional<Asset> existingAsset = assetRepository.findBySymbolAndAssetType(
                buyRequest.getSymbol(),
                buyRequest.getAssetType()
        );

        Asset asset;
        if (existingAsset.isPresent()) {
            asset = existingAsset.get();
        } else {
            asset = new Asset(buyRequest.getSymbol(), buyRequest.getAssetName(), buyRequest.getAssetType());
            asset = assetRepository.save(asset);
        }

        // 5. Get or create PortfolioPosition
        Optional<PortfolioPosition> existingPosition = positionRepository.findByPortfolioAndAsset(portfolio, asset);

        PortfolioPosition position;
        if (existingPosition.isPresent()) {
            // Update existing position with weighted average cost
            position = existingPosition.get();
            BigDecimal currentValue = position.getQuantity().multiply(position.getAverageBuyPrice());
            BigDecimal newValue = buyRequest.getQuantity().multiply(buyRequest.getCurrentPrice());
            BigDecimal totalQuantity = position.getQuantity().add(buyRequest.getQuantity());
            BigDecimal newAvgPrice = currentValue.add(newValue).divide(totalQuantity, 6, RoundingMode.HALF_UP);

            position.setQuantity(totalQuantity);
            position.setAverageBuyPrice(newAvgPrice);
            position.setUpdatedAt(Instant.now());
        } else {
            // Create new position
            position = new PortfolioPosition(
                    portfolio,
                    asset,
                    buyRequest.getQuantity(),
                    buyRequest.getCurrentPrice()
            );
        }

        position = positionRepository.save(position);

        // 6. Deduct cash from portfolio
        portfolio.setCashBalance(portfolio.getCashBalance().subtract(totalCost));
        portfolioRepository.save(portfolio);

        // 7. Record transaction
        Transaction transaction = new Transaction();
        transaction.setPortfolio(portfolio);
        transaction.setAsset(asset);
        transaction.setTransactionType("BUY");
        transaction.setQuantity(buyRequest.getQuantity());
        transaction.setPriceAtTransaction(buyRequest.getCurrentPrice());
        transaction.setTotalAmount(totalCost);
        transaction.setTransactionDate(Instant.now());
        transactionRepository.save(transaction);

        return position;
    }

    @Transactional
    public PortfolioPosition executeSell(Long portfolioId, Long positionId, BigDecimal quantityToSell, BigDecimal currentPrice) {
        // 1. Validate portfolio exists
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found"));

        // 2. Validate position exists and belongs to this portfolio
        PortfolioPosition position = positionRepository.findById(positionId)
                .orElseThrow(() -> new IllegalArgumentException("Position not found"));
        
        if (!position.getPortfolio().getId().equals(portfolioId)) {
            throw new IllegalArgumentException("Position does not belong to this portfolio");
        }

        // 3. Validate sufficient quantity
        if (quantityToSell.compareTo(position.getQuantity()) > 0) {
            throw new IllegalArgumentException("Cannot sell more shares than you own");
        }

        if (quantityToSell.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }

        // 4. Calculate proceeds
        BigDecimal totalProceeds = quantityToSell.multiply(currentPrice);

        // Store asset reference before potentially deleting position
        Asset asset = position.getAsset();

        // 5. Update or delete position
        BigDecimal newQuantity = position.getQuantity().subtract(quantityToSell);
        
        if (newQuantity.compareTo(BigDecimal.ZERO) == 0) {
            // Sold all shares - delete position
            positionRepository.delete(position);
            position = null; // Will return null to indicate position closed
        } else {
            // Partial sale - update quantity
            position.setQuantity(newQuantity);
            position.setUpdatedAt(Instant.now());
            position = positionRepository.save(position);
        }

        // 6. Add proceeds to portfolio cash balance
        portfolio.setCashBalance(portfolio.getCashBalance().add(totalProceeds));
        portfolioRepository.save(portfolio);

        // 7. Record transaction
        Transaction transaction = new Transaction();
        transaction.setPortfolio(portfolio);
        transaction.setAsset(asset);
        transaction.setTransactionType("SELL");
        transaction.setQuantity(quantityToSell);
        transaction.setPriceAtTransaction(currentPrice);
        transaction.setTotalAmount(totalProceeds);
        transaction.setTransactionDate(Instant.now());
        transactionRepository.save(transaction);

        return position; // null if position fully closed, updated position if partial sale
    }
}