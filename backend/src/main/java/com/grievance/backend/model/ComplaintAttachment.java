package com.grievance.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "complaint_attachments")
@Data
public class ComplaintAttachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileUrl;

    @ManyToOne
    @JoinColumn(name = "complaint_id")
    private Complaint complaint;
}
