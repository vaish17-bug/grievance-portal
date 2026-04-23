package com.grievance.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String message;
    private String type; // "STATUS_UPDATE", "ASSIGNED", "RESOLVED"
    private boolean isRead = false;

    @ManyToOne
    @JoinColumn(name = "complaint_id")
    private Complaint complaint;

    private LocalDateTime createdAt = LocalDateTime.now();
}