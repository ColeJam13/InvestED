package com.zipcode.invested.position;

import com.zipcode.invested.portfolio.Portfolio;
import com.zipcode.invested.asset.Asset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PortfolioPositionRepository extends JpaRepository<PortfolioPosition, Long> {

    List<PortfolioPosition> findByPortfolio(Portfolio portfolio);

    Optional<PortfolioPosition> findByPortfolioAndAsset(Portfolio portfolio, Asset asset);
}
