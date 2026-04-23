package com.grievance.backend.repository;

import com.grievance.backend.model.Complaint;
import com.grievance.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    // Get all complaints by a specific citizen
    List<Complaint> findByCitizen(User citizen);

    // Get complaints by status
    List<Complaint> findByStatus(Complaint.Status status);

    // Count by status (for dashboard stats)
    long countByStatus(Complaint.Status status);
}
