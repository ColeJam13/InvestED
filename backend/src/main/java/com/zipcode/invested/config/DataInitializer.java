package com.zipcode.invested.config;

import com.zipcode.invested.portfolio.Portfolio;
import com.zipcode.invested.service.PortfolioService;
import com.zipcode.invested.service.UserService;
import com.zipcode.invested.user.User;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserService userService;
    private final PortfolioService portfolioService;

    public DataInitializer(UserService userService, PortfolioService portfolioService) {
        this.userService = userService;
        this.portfolioService = portfolioService;
    }

    @Override
    public void run(String... args) throws Exception {

        if (userService.findById(1L).isEmpty()) {

            User testUser = new User("test@example.com", "John Smith");
            User savedUser = userService.create(testUser);

            Portfolio mainPortfolio = new Portfolio(savedUser, "Main Portfolio");
            mainPortfolio.setCashBalance(new BigDecimal("10000.00"));
            portfolioService.save(mainPortfolio);

            Portfolio retirementPortfolio = new Portfolio(savedUser, "Retirement");
            retirementPortfolio.setCashBalance(new BigDecimal("10000.00"));
            portfolioService.save(retirementPortfolio);

            System.out.println("Test data initialized: User ID " + savedUser.getId());
        } else {
            System.out.println("Test data already exists, skipping initialization");
        }
    }
}