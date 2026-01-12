package com.zipcode.invested.controller;

import com.zipcode.invested.risk.RiskProfile;
import com.zipcode.invested.service.RiskProfileService;
import com.zipcode.invested.user.User;
import com.zipcode.invested.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/risk-profiles")
public class RiskProfileController {

    private final RiskProfileService riskProfileService;
    private final UserService userService;

    public RiskProfileController(RiskProfileService riskProfileService, UserService userService) {
        this.riskProfileService = riskProfileService;
        this.userService = userService;
    }

    @GetMapping
    public List<RiskProfile> getAll() {
        return riskProfileService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RiskProfile> getById(@PathVariable Long id) {
        return riskProfileService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create or update a user's risk profile
    @PostMapping("/user/{userId}")
    public ResponseEntity<RiskProfile> upsertForUser(@PathVariable Long userId, @RequestBody RiskProfile body) {
        User user = userService.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        // force-link to the correct user (don't trust request body)
        body.setUser(user);

        RiskProfile saved = riskProfileService.save(body);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
