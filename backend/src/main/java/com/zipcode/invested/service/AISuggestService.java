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
    private final HuggingFaceInferenceService huggingFaceInferenceService;

    public AISuggestService(
            UserService userService,
            AIConversationService aiConversationService,
            HuggingFaceInferenceService huggingFaceInferenceService
    ) {
        this.userService = userService;
        this.aiConversationService = aiConversationService;
        this.huggingFaceInferenceService = huggingFaceInferenceService;
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

        String prompt =
            "Personality: " + personality + "\n\n" +
            "User question:\n" +
            request.getPrompt().trim() + "\n\n" +
            "FORMAT RULES:\n" +
            "- Use clear section headers\n" +
            "- Use numbered steps where appropriate\n" +
            "- Use bullet points for lists\n" +
            "- Keep spacing between sections\n" +
            "- Do NOT write a single long paragraph\n";


        String rawReply = huggingFaceInferenceService.generate(prompt);

        // ✅ GUARANTEED removal of leaked thinking / tags
        String reply = stripThinking(rawReply).trim();

        // Save conversation transcript
        String transcript = "personality=" + personality + "\n" +
                "user: " + request.getPrompt().trim() + "\n" +
                "assistant: " + reply;

        AIConversation convo = new AIConversation(user, "AI Suggest", transcript);
        AIConversation saved = aiConversationService.save(convo);

        return new AISuggestResponse(saved.getId(), reply);
    }

    private String stripThinking(String text) {
        if (text == null) return "";

        // Remove <think>...</think> blocks (multiline)
        String cleaned = text.replaceAll("(?s)<think>.*?</think>", "");

        // Also remove any stray tags if model prints them without closing properly
        cleaned = cleaned.replace("<think>", "").replace("</think>", "");

        return cleaned;
    }
}
