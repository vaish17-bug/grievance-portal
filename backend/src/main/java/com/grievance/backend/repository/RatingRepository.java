package com.grievance.backend.repository;

import com.grievance.backend.model.Rating;
import com.grievance.backend.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByComplaint(Complaint complaint);
    boolean existsByComplaint(Complaint complaint);
}