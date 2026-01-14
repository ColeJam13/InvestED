package com.zipcode.invested.ai;

import com.zipcode.invested.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AIConversationRepository extends JpaRepository<AIConversation, Long> {

    List<AIConversation> findByUser(User user);
}
