package com.zipcode.invested.portfolio;

import com.zipcode.invested.user.User;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "portfolio")
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal cashBalance = BigDecimal.valueOf(10000.00); 

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    protected Portfolio() {}

    public Portfolio(User user, String name) {
        this.user = user;
        this.name = name;
        this.cashBalance = BigDecimal.valueOf(10000.00); 
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getName() { return name; }
    public BigDecimal getCashBalance() { return cashBalance; }
    public Instant getCreatedAt() { return createdAt; }

    public void setUser(User user) { this.user = user; }
    public void setName(String name) { this.name = name; }
    public void setCashBalance(BigDecimal cashBalance) { this.cashBalance = cashBalance; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}