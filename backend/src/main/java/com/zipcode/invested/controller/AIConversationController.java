package com.zipcode.invested.controller;

import com.zipcode.invested.ai.AIConversation;
import com.zipcode.invested.service.AIConversationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;


import java.util.List;

@RestController
@RequestMapping("/api/ai-conversations")
public class AIConversationController {

    private final AIConversationService aiConversationService;

    public AIConversationController(AIConversationService aiConversationService) {
        this.aiConversationService = aiConversationService;
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
        return ResponseEntity.ok(aiConversationService.findByUserId(userId));
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<AIConversation> createForUser(
            @PathVariable Long userId,
            @Valid @RequestBody CreateAIConversationRequest body
    ) {
    AIConversation saved = aiConversationService.createForUser(
                userId,
                body.getTitle(),
                body.getTranscript()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    public static class CreateAIConversationRequest {

        @NotBlank(message = "title is required")
        private String title;

        @NotBlank(message = "transcript is required")
        private String transcript;

        public String getTitle() {
            return title;
        }

        public String getTranscript() {
            return transcript;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public void setTranscript(String transcript) {
            this.transcript = transcript;
        }
    }
}
