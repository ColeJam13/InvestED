package com.zipcode.invested.service;

import com.zipcode.invested.risk.RiskProfile;
import com.zipcode.invested.risk.RiskProfileRepository;
import com.zipcode.invested.user.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RiskProfileService {

    private final RiskProfileRepository riskProfileRepository;

    public RiskProfileService(RiskProfileRepository riskProfileRepository) {
        this.riskProfileRepository = riskProfileRepository;
    }

    public List<RiskProfile> findAll() {
        return riskProfileRepository.findAll();
    }

    public Optional<RiskProfile> findById(Long id) {
        return riskProfileRepository.findById(id);
    }

    public Optional<RiskProfile> findByUser(User user) {
        return riskProfileRepository.findByUser(user);
    }

    public RiskProfile save(RiskProfile riskProfile) {
        return riskProfileRepository.save(riskProfile);
    }
}
