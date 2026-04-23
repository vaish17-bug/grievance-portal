package com.grievance.backend.repository;

import com.grievance.backend.model.StatusHistory;
import com.grievance.backend.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StatusHistoryRepository extends JpaRepository<StatusHistory, Long> {
    List<StatusHistory> findByComplaintOrderByUpdatedAtDesc(Complaint complaint);
}
