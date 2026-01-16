package com.zipcode.invested.ai;

import com.zipcode.invested.user.User;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "ai_conversation")
public class AIConversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 120)
    private String title; 

    @Column(nullable = false, columnDefinition = "text")
    private String transcript; 

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    protected AIConversation() {}

    public AIConversation(User user, String title, String transcript) {
        this.user = user;
        this.title = title;
        this.transcript = transcript;
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getTitle() { return title; }
    public String getTranscript() { return transcript; }
    public Instant getCreatedAt() { return createdAt; }

    public void setUser(User user) { this.user = user; }
    public void setTitle(String title) { this.title = title; }
    public void setTranscript(String transcript) { this.transcript = transcript; }
}
