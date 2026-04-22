package com.grievance.backend.controller;

import com.grievance.backend.model.Department;
import com.grievance.backend.repository.DepartmentRepository;
import com.grievance.backend.repository.UserRepository;
import com.grievance.backend.model.User;
import com.grievance.backend.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.nio.file.Path;
import java.nio.file.Paths;
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

    // GET /api/public/uploads/{filename} — serve uploaded files
    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        try {
            Path file = Paths.get("uploads/" + filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                throw new RuntimeException("Could not read the file!");
            }
        } catch (Exception e) {
            throw new RuntimeException("Could not read the file!");
        }
    }
}
