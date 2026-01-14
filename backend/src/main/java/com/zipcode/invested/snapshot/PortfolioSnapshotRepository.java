package com.zipcode.invested.snapshot;

import com.zipcode.invested.portfolio.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PortfolioSnapshotRepository extends JpaRepository<PortfolioSnapshot, Long> {

    List<PortfolioSnapshot> findByPortfolio(Portfolio portfolio);
}
