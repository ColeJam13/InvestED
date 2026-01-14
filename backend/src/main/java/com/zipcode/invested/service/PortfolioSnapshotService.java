package com.zipcode.invested.service;

import com.zipcode.invested.snapshot.PortfolioSnapshot;
import com.zipcode.invested.snapshot.PortfolioSnapshotRepository;
import com.zipcode.invested.portfolio.Portfolio;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PortfolioSnapshotService {

    private final PortfolioSnapshotRepository snapshotRepository;

    public PortfolioSnapshotService(PortfolioSnapshotRepository snapshotRepository) {
        this.snapshotRepository = snapshotRepository;
    }

    public List<PortfolioSnapshot> findByPortfolio(Portfolio portfolio) {
        return snapshotRepository.findByPortfolio(portfolio);
    }

    public Optional<PortfolioSnapshot> findById(Long id) {
        return snapshotRepository.findById(id);
    }

    public PortfolioSnapshot save(PortfolioSnapshot snapshot) {
        return snapshotRepository.save(snapshot);
    }
}
