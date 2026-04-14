package com.grievance.backend.dto;
import lombok.Data;

@Data
public class AuthRequest {
    private String name;
    private String email;
    private String password;
    private String role;  // CITIZEN, WORKER, ADMIN
    private String phone;
}