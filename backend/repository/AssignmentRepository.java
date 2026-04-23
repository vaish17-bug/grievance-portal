package com.grievance.backend.repository;

import com.grievance.backend.model.Assignment;
import com.grievance.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    // Get all tasks assigned to a specific worker
    List<Assignment> findByWorker(User worker);
}