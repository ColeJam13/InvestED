package com.zipcode.invested.dto;

public class AISuggestResponse {

    private Long conversationId;
    private String reply;

    public AISuggestResponse() {}

    public AISuggestResponse(Long conversationId, String reply) {
        this.conversationId = conversationId;
        this.reply = reply;
    }

    public Long getConversationId() { return conversationId; }
    public String getReply() { return reply; }

    public void setConversationId(Long conversationId) { this.conversationId = conversationId; }
    public void setReply(String reply) { this.reply = reply; }
}
