package com.grievance.backend.dto;
import lombok.Data;

@Data
public class ComplaintRequest {
    private String title;
    private String description;
    private String category;
    private Double latitude;
    private Double longitude;
    private Long departmentId;
    private String address;
}