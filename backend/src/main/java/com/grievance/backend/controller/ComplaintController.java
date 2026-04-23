package com.grievance.backend.controller;

import com.grievance.backend.dto.ComplaintRequest;
import com.grievance.backend.model.*;
import com.grievance.backend.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    // POST /api/complaints — citizen submits complaint
   // POST /api/complaints
@PostMapping
public ResponseEntity<Complaint> submit(
        @RequestParam String title,
        @RequestParam String description,
        @RequestParam String category,
        @RequestParam(required = false) Double latitude,
        @RequestParam(required = false) Double longitude,
        @RequestParam(required = false) Long departmentId,
        @RequestParam(required = false) List<MultipartFile> photos,  // ← Changed to List
        Authentication auth) throws Exception {

    List<String> photoUrls = new ArrayList<>();

    if (photos != null) {
        for (MultipartFile photo : photos) {
            if (!photo.isEmpty()) {
                String uploadDir = "uploads/";
                new File(uploadDir).mkdirs();
                String filename = System.currentTimeMillis() + "_" + photo.getOriginalFilename();
                photo.transferTo(new File(uploadDir + filename));
                photoUrls.add("/uploads/" + filename);
            }
        }
    }

    ComplaintRequest request = new ComplaintRequest();
    request.setTitle(title);
    request.setDescription(description);
    request.setCategory(category);
    request.setLatitude(latitude);
    request.setLongitude(longitude);
    request.setDepartmentId(departmentId);

    return ResponseEntity.ok(
        complaintService.submitComplaint(request, auth.getName(), String.join(",", photoUrls))
    );
}

    // GET /api/complaints — admin gets all complaints
    @GetMapping
    public ResponseEntity<List<Complaint>> getAll() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    // GET /api/complaints/my — citizen gets their own complaints
    @GetMapping("/my")
    public ResponseEntity<List<Complaint>> getMine(Authentication auth) {
        return ResponseEntity.ok(complaintService.getMyCitizensComplaints(auth.getName()));
    }

    // POST /api/complaints/{id}/assign — admin assigns to worker
    @PostMapping("/{id}/assign")
    public ResponseEntity<Assignment> assign(
            @PathVariable Long id,
            @RequestParam Long workerId,
            Authentication auth) {
        return ResponseEntity.ok(complaintService.assignComplaint(id, workerId, auth.getName()));
    }

    // PATCH /api/complaints/{id}/status — worker updates status
    @PatchMapping("/{id}/status")
    public ResponseEntity<Complaint> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String remark,
            Authentication auth) {
        return ResponseEntity.ok(complaintService.updateStatus(id, status, remark, auth.getName()));
    }

    // GET /api/complaints/{id}/history — get status history
    @GetMapping("/{id}/history")
    public ResponseEntity<List<StatusHistory>> getHistory(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.getHistory(id));
    }

    // GET /api/complaints/worker-tasks — worker gets their assigned tasks
    @GetMapping("/worker-tasks")
    public ResponseEntity<List<Assignment>> getWorkerTasks(Authentication auth) {
        return ResponseEntity.ok(complaintService.getWorkerTasks(auth.getName()));
    }
}
