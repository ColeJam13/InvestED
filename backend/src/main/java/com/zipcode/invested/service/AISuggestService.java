package com.zipcode.invested.service;

import com.zipcode.invested.ai.AIConversation;
import com.zipcode.invested.dto.AISuggestRequest;
import com.zipcode.invested.dto.AISuggestResponse;
import com.zipcode.invested.user.User;
import org.springframework.stereotype.Service;

@Service
public class AISuggestService {

    private final UserService userService;
    private final AIConversationService aiConversationService;

    public AISuggestService(UserService userService, AIConversationService aiConversationService) {
        this.userService = userService;
        this.aiConversationService = aiConversationService;
    }

    public AISuggestResponse suggest(AISuggestRequest request) {
        if (request == null || request.getUserId() == null) {
            throw new IllegalArgumentException("userId is required");
        }
        if (request.getPrompt() == null || request.getPrompt().trim().isEmpty()) {
            throw new IllegalArgumentException("prompt is required");
        }

        User user = userService.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + request.getUserId()));

        String personality = (request.getPersonalityKey() == null || request.getPersonalityKey().isBlank())
                ? "default"
                : request.getPersonalityKey().trim();

        // Placeholder reply for now (later: call cloud AI provider here)
        String reply = "MVP AI Suggest (" + personality + "): I received your prompt: \"" +
                request.getPrompt().trim() + "\"";

        // Save conversation transcript (simple MVP format)
        String transcript = "personality=" + personality + "\n" +
                "user: " + request.getPrompt().trim() + "\n" +
                "assistant: " + reply;

        AIConversation convo = new AIConversation(user, "AI Suggest", transcript);
        AIConversation saved = aiConversationService.save(convo);

        return new AISuggestResponse(saved.getId(), reply);
    }
}
