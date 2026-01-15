package com.zipcode.invested.ai;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AIConversationRepository extends JpaRepository<AIConversation, Long> {

    List<AIConversation> findAllByUser_Id(Long userId);
}
