package com.zipcode.invested.dto;

public class AISuggestRequest {

    private Long userId;
    private String prompt;

    private String personalityKey;

    public AISuggestRequest() {}

    public Long getUserId() { return userId; }
    public String getPrompt() { return prompt; }
    public String getPersonalityKey() { return personalityKey; }

    public void setUserId(Long userId) { this.userId = userId; }
    public void setPrompt(String prompt) { this.prompt = prompt; }
    public void setPersonalityKey(String personalityKey) { this.personalityKey = personalityKey; }
}
