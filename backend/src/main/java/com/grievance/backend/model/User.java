package com.grievance.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data  // Lombok: auto-generates getters, setters, toString
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String phone;

    private LocalDateTime createdAt = LocalDateTime.now();

    // Enum for user types
    public enum Role {
        CITIZEN, WORKER, ADMIN
    }
}