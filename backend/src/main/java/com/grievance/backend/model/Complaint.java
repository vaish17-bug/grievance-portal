package com.grievance.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String category;
    private String status;
    private String address;

    private Double latitude;
    private Double longitude;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne
    @JoinColumn(name = "citizen_id")
    private User citizen;
}