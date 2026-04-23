package com.grievance.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Data
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String category;
    private String photoUrl;
    private Double latitude;
    private Double longitude;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    // Many complaints belong to one citizen
    @ManyToOne
    @JoinColumn(name = "citizen_id")
    private User citizen;

    // Many complaints belong to one department
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        PENDING, ASSIGNED, IN_PROGRESS, RESOLVED, REJECTED
    }
}