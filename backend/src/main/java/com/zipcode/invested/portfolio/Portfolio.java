package com.zipcode.invested.portfolio;

import com.zipcode.invested.user.User;
import jakarta.persistence.*;

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

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    protected Portfolio() {}

    public Portfolio(User user, String name) {
        this.user = user;
        this.name = name;
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getName() { return name; }
    public Instant getCreatedAt() { return createdAt; }

    public void setUser(User user) { this.user = user; }
    public void setName(String name) { this.name = name; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
