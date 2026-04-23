package com.grievance.backend.service;

import com.grievance.backend.model.*;
import com.grievance.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public Rating submitRating(Long complaintId, int stars, String feedback, String citizenEmail) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        // Only allow rating RESOLVED complaints
        if (complaint.getStatus() != Complaint.Status.RESOLVED) {
            throw new RuntimeException("Can only rate resolved complaints");
        }

        // Prevent duplicate rating
        if (ratingRepository.existsByComplaint(complaint)) {
            throw new RuntimeException("Already rated");
        }

        User citizen = userRepository.findByEmail(citizenEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Rating rating = new Rating();
        rating.setComplaint(complaint);
        rating.setCitizen(citizen);
        rating.setStars(stars);
        rating.setFeedback(feedback);

        return ratingRepository.save(rating);
    }

    public Rating getRating(Long complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        return ratingRepository.findByComplaint(complaint).orElse(null);
    }
}