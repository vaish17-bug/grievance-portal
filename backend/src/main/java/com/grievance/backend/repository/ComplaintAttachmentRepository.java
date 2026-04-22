package com.grievance.backend.repository;

import com.grievance.backend.model.ComplaintAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplaintAttachmentRepository extends JpaRepository<ComplaintAttachment, Long> {
}
