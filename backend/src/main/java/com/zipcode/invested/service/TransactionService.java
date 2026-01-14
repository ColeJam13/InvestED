package com.zipcode.invested.service;

import com.zipcode.invested.portfolio.Portfolio;
import com.zipcode.invested.transaction.Transaction;
import com.zipcode.invested.transaction.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {
    
    private final TransactionRepository transactionRepository;
    
    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }
    
    public Transaction save(Transaction transaction) {
        return transactionRepository.save(transaction);
    }
    
    public List<Transaction> findByPortfolio(Portfolio portfolio) {
        return transactionRepository.findByPortfolioOrderByTransactionDateDesc(portfolio);
    }
}