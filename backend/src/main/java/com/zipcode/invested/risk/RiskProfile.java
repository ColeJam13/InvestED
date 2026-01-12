package com.zipcode.invested.risk;

import com.zipcode.invested.user.User;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "risk_profile")
public class RiskProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private Integer riskScore; 

    @Column(nullable = false, length = 40)
    private String riskLevel;  
    
    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    protected RiskProfile() {}

    public RiskProfile(User user, Integer riskScore, String riskLevel) {
        this.user = user;
        this.riskScore = riskScore;
        this.riskLevel = riskLevel;
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public Integer getRiskScore() { return riskScore; }
    public String getRiskLevel() { return riskLevel; }
    public Instant getUpdatedAt() { return updatedAt; }

    public void setUser(User user) { this.user = user; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
