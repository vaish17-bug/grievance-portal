package com.grievance.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "ratings")
@Data
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "complaint_id", unique = true)
    private Complaint complaint;

    @ManyToOne
    @JoinColumn(name = "citizen_id")
    private User citizen;

    private int stars; // 1 to 5

    @Column(columnDefinition = "TEXT")
    private String feedback;

    private LocalDateTime createdAt = LocalDateTime.now();
}
