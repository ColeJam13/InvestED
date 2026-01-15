package com.zipcode.invested.service;

import com.zipcode.invested.ai.AIConversation;
import com.zipcode.invested.ai.AIConversationRepository;
import com.zipcode.invested.user.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AIConversationService {

    private final AIConversationRepository aiConversationRepository;

    public AIConversationService(AIConversationRepository aiConversationRepository) {
        this.aiConversationRepository = aiConversationRepository;
    }

    public List<AIConversation> findAll() {
        return aiConversationRepository.findAll();
    }

    public Optional<AIConversation> findById(Long id) {
        return aiConversationRepository.findById(id);
    }

    public List<AIConversation> findByUserId(Long userId) {
        return aiConversationRepository.findByUserId(userId);
    }

    public AIConversation save(AIConversation conversation) {
        return aiConversationRepository.save(conversation);
    }
}
