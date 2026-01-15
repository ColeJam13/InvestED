package com.zipcode.invested.ai;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AIConversationRepository extends JpaRepository<AIConversation, Long> {

    @Query("select c from AIConversation c where c.user.id = :userId")
    List<AIConversation> findByUserId(@Param("userId") Long userId);
}
