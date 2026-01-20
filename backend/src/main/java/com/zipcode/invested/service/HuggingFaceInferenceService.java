package com.zipcode.invested.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class HuggingFaceInferenceService {

    private static final Duration CACHE_TTL = Duration.ofMinutes(30);

    private static class CacheEntry {
        final String value;
        final Instant createdAt;

        CacheEntry(String value) {
            this.value = value;
            this.createdAt = Instant.now();
        }

        boolean isExpired() {
            return Instant.now().isAfter(createdAt.plus(CACHE_TTL));
        }
    }

    private final ConcurrentHashMap<String, CacheEntry> cache = new ConcurrentHashMap<>();

    private final RestClient client;
    private final String model;

    public HuggingFaceInferenceService(
            @Value("${hf.apiKey}") String apiKey,
            @Value("${hf.model}") String model
    ) {
        this.client = RestClient.builder()
                .baseUrl("https://router.huggingface.co/v1")
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, "application/json")
                .build();

        this.model = normalizeModel(model);
    }

    private String normalizeModel(String model) {
        if (model == null || model.isBlank()) {
            return "HuggingFaceTB/SmolLM3-3B:hf-inference";
        }
        String trimmed = model.trim();
        return trimmed.contains(":") ? trimmed : (trimmed + ":hf-inference");
    }

    @SuppressWarnings("unchecked")
    public String generate(String prompt) {
        // ✅ Strong system prompt to reduce "thinking" leakage + keep replies complete
        String system =
                "You are a financial EDUCATION assistant (not a financial advisor). " +
                        "Give general info and explain concepts clearly. " +
                        "Do NOT provide professional advice. " +
                        "IMPORTANT: Do NOT output internal reasoning or hidden thoughts. " +
                        "Never output <think>...</think> or any chain-of-thought. " +
                        "Only output the final answer. " +
                        "If you need to reason, do it silently. " +
                        "Keep responses concise unless the user asks for detail.";

        String safePrompt = prompt == null ? "" : prompt.trim();
        if (safePrompt.isBlank()) {
            throw new IllegalArgumentException("Prompt cannot be blank");
        }

        // ✅ Simple in-memory cache (great for demo): same prompt returns instantly
        // Include model + system so you don't accidentally reuse across config changes
        String cacheKey = model + "::" + system + "::" + safePrompt;

        CacheEntry cached = cache.get(cacheKey);
        if (cached != null) {
            if (!cached.isExpired()) {
                return cached.value;
            }
            // expired
            cache.remove(cacheKey);
        }

        Map<String, Object> body = Map.of(
                "model", model,
                "messages", List.of(
                        Map.of("role", "system", "content", system),
                        Map.of("role", "user", "content", safePrompt)
                ),
                "temperature", 0.4,

                // Increase to reduce cut-offs. Adjust if you want longer/shorter.
                "max_tokens", 1000
        );

        try {
            Map<String, Object> resp = client.post()
                    .uri("/chat/completions")
                    .body(body)
                    .retrieve()
                    .body(Map.class);

            if (resp == null) {
                throw new IllegalStateException("Hugging Face returned an empty response");
            }

            Object choicesObj = resp.get("choices");
            if (!(choicesObj instanceof List<?> choices) || choices.isEmpty()) {
                Object err = resp.get("error");
                throw new IllegalStateException("Unexpected HF response (no choices). error=" + err);
            }

            Object firstChoiceObj = choices.get(0);
            if (!(firstChoiceObj instanceof Map<?, ?> firstChoice)) {
                throw new IllegalStateException("Unexpected HF response (choice not object): " + firstChoiceObj);
            }

            Object messageObj = firstChoice.get("message");
            if (!(messageObj instanceof Map<?, ?> message)) {
                throw new IllegalStateException("Unexpected HF response (missing message): " + firstChoice);
            }

            Object contentObj = message.get("content");
            String content = contentObj == null ? "" : contentObj.toString();

            if (content.isBlank()) {
                throw new IllegalStateException("Unexpected HF response (empty content): " + resp);
            }

            // store in cache for subsequent identical prompts
            cache.put(cacheKey, new CacheEntry(content));

            return content;

        } catch (RestClientResponseException ex) {
            HttpStatusCode status = ex.getStatusCode();
            String bodyText = ex.getResponseBodyAsString();

            String msg =
                    "Hugging Face HTTP " + status.value() +
                            " - " +
                            (bodyText == null || bodyText.isBlank()
                                    ? status.toString()
                                    : bodyText);

            throw new IllegalStateException(msg, ex);
        }
    }
}
