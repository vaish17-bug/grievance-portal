package com.grievance.backend.controller;

import com.grievance.backend.model.Rating;
import com.grievance.backend.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    // POST /api/ratings/{complaintId}?stars=4&feedback=Good job
    @PostMapping("/{complaintId}")
    public ResponseEntity<Rating> rate(
            @PathVariable Long complaintId,
            @RequestParam int stars,
            @RequestParam(required = false) String feedback,
            Authentication auth) {
        return ResponseEntity.ok(
            ratingService.submitRating(complaintId, stars, feedback, auth.getName())
        );
    }

    // GET /api/ratings/{complaintId}
    @GetMapping("/{complaintId}")
    public ResponseEntity<Rating> get(@PathVariable Long complaintId) {
        return ResponseEntity.ok(ratingService.getRating(complaintId));
    }
}