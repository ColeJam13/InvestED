package com.zipcode.invested.transaction;

import com.zipcode.invested.portfolio.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findByPortfolioOrderByTransactionDateDesc(Portfolio portfolio);
}