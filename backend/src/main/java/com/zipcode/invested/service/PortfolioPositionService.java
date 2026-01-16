package com.zipcode.invested.service;

import com.zipcode.invested.position.PortfolioPosition;
import com.zipcode.invested.position.PortfolioPositionRepository;
import com.zipcode.invested.portfolio.Portfolio;
import com.zipcode.invested.asset.Asset;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PortfolioPositionService {

    private final PortfolioPositionRepository positionRepository;

    public PortfolioPositionService(PortfolioPositionRepository positionRepository) {
        this.positionRepository = positionRepository;
    }

    public List<PortfolioPosition> findByPortfolio(Portfolio portfolio) {
        return positionRepository.findByPortfolio(portfolio);
    }

    public Optional<PortfolioPosition> findByPortfolioAndAsset(Portfolio portfolio, Asset asset) {
        return positionRepository.findByPortfolioAndAsset(portfolio, asset);
    }

    public PortfolioPosition save(PortfolioPosition position) {
        return positionRepository.save(position);
    }
}
