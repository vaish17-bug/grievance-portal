package com.grievance.backend.controller;

import com.grievance.backend.model.Department;
import com.grievance.backend.repository.DepartmentRepository;
import com.grievance.backend.repository.UserRepository;
import com.grievance.backend.model.User;
import com.grievance.backend.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final ComplaintService complaintService;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    // GET /api/public/stats — anyone can see city stats
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(complaintService.getStats());
    }

    // GET /api/public/departments — needed for complaint form
    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getDepartments() {
        return ResponseEntity.ok(departmentRepository.findAll());
    }

    // GET /api/public/workers — admin needs list of workers
    @GetMapping("/workers")
    public ResponseEntity<List<User>> getWorkers() {
        return ResponseEntity.ok(userRepository.findByRole(User.Role.WORKER));
    }
}