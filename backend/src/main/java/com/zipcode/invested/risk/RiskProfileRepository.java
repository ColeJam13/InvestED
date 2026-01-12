package com.zipcode.invested.risk;

import com.zipcode.invested.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RiskProfileRepository extends JpaRepository<RiskProfile, Long> {

    Optional<RiskProfile> findByUser(User user);
}
