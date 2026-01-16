package com.zipcode.invested.service;

import com.zipcode.invested.ai.AIConversation;
import com.zipcode.invested.ai.AIConversationRepository;
import org.springframework.stereotype.Service;
import com.zipcode.invested.user.User;
import com.zipcode.invested.service.UserService;



import java.util.List;
import java.util.Optional;

@Service
public class AIConversationService {

    private final AIConversationRepository aiConversationRepository;
    private final UserService userService;

    public AIConversationService(AIConversationRepository aiConversationRepository, UserService userService) {
        this.aiConversationRepository = aiConversationRepository;
        this.userService = userService;
    }

    public List<AIConversation> findAll() {
        return aiConversationRepository.findAll();
    }

    public Optional<AIConversation> findById(Long id) {
        return aiConversationRepository.findById(id);
    }

    public List<AIConversation> findByUserId(Long userId) {
        return aiConversationRepository.findAllByUser_Id(userId);
    }

    public AIConversation createForUser(Long userId, String title, String transcript) {
    User user = userService.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
    AIConversation convo = new AIConversation(user, title, transcript);
        return aiConversationRepository.save(convo);
    }

    public AIConversation save(AIConversation conversation) {
        return aiConversationRepository.save(conversation);
    }
}
