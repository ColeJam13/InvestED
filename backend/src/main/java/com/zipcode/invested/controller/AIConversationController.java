package com.zipcode.invested.controller;

import com.zipcode.invested.ai.AIConversation;
import com.zipcode.invested.service.AIConversationService;
import com.zipcode.invested.service.UserService;
import com.zipcode.invested.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai-conversations")
public class AIConversationController {

    private final AIConversationService aiConversationService;
    private final UserService userService;

    public AIConversationController(
            AIConversationService aiConversationService,
            UserService userService
    ) {
        this.aiConversationService = aiConversationService;
        this.userService = userService;
    }

    @GetMapping
    public List<AIConversation> getAll() {
        return aiConversationService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AIConversation> getById(@PathVariable Long id) {
        return aiConversationService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AIConversation>> getByUser(@PathVariable Long userId) {
        User user = userService.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(aiConversationService.findByUser(user));
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<AIConversation> createForUser(
            @PathVariable Long userId,
            @RequestBody AIConversation body
    ) {
        User user = userService.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        body.setUser(user);
        AIConversation saved = aiConversationService.save(body);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
