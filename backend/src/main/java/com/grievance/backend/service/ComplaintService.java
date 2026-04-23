package com.grievance.backend.service;

import com.grievance.backend.dto.ComplaintRequest;
import com.grievance.backend.model.*;
import com.grievance.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final AssignmentRepository assignmentRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final NotificationService notificationService;

    // Citizen submits a new complaint
    public Complaint submitComplaint(ComplaintRequest request, String citizenEmail, String photoUrl) {
        User citizen = userRepository.findByEmail(citizenEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Complaint complaint = new Complaint();
        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setCategory(request.getCategory());
        complaint.setLatitude(request.getLatitude());
        complaint.setLongitude(request.getLongitude());
        complaint.setPhotoUrl(photoUrl);
        complaint.setCitizen(citizen);

        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            complaint.setDepartment(dept);
        }

        Complaint saved = complaintRepository.save(complaint);

        // Save initial status in history
        saveStatusHistory(saved, "PENDING", "Complaint submitted", citizen);
        userRepository.findByRole(User.Role.ADMIN).forEach(admin ->
    notificationService.createNotification(
        admin,
        "New complaint submitted by " + citizen.getName() + ": " + complaint.getTitle(),
        "NEW_COMPLAINT",
        saved
    )
      );
        return saved;
    }

    // Admin assigns complaint to worker
    public Assignment assignComplaint(Long complaintId, Long workerId, String adminEmail) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        Assignment assignment = new Assignment();
        assignment.setComplaint(complaint);
        assignment.setWorker(worker);
        assignment.setSlaDeadline(LocalDateTime.now().plusDays(3)); // 3-day SLA

        complaint.setStatus(Complaint.Status.ASSIGNED);
        complaintRepository.save(complaint);
        saveStatusHistory(complaint, "ASSIGNED", "Assigned to worker: " + worker.getName(), admin);
        Assignment saved = assignmentRepository.save(assignment);
        notificationService.createNotification(
    worker,
    "New task assigned: " + complaint.getTitle(),
    "ASSIGNED",
    complaint
);
notificationService.createNotification(
    complaint.getCitizen(),
    "Your complaint '" + complaint.getTitle() + "' has been assigned to a worker.",
    "STATUS_UPDATE",
    complaint
);
        return saved;
    }

    // Worker updates complaint status
    public Complaint updateStatus(Long complaintId, String status, String remark, String workerEmail) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        User worker = userRepository.findByEmail(workerEmail)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        complaint.setStatus(Complaint.Status.valueOf(status));
        complaintRepository.save(complaint);
        saveStatusHistory(complaint, status, remark, worker);
          notificationService.createNotification(
    complaint.getCitizen(),
    "Your complaint '" + complaint.getTitle() + "' status changed to: " + status,
    "STATUS_UPDATE",
    complaint
);
        return complaint;
    }

    // Get all complaints (admin)
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    // Get complaints by citizen
    public List<Complaint> getMyCitizensComplaints(String email) {
        User citizen = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return complaintRepository.findByCitizen(citizen);
    }

    // Get tasks assigned to worker
    public List<Assignment> getWorkerTasks(String email) {
        User worker = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Worker not found"));
        return assignmentRepository.findByWorker(worker);
    }

    // Get status history of a complaint
    public List<StatusHistory> getHistory(Long complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        return statusHistoryRepository.findByComplaintOrderByUpdatedAtDesc(complaint);
    }

    // Private helper to save status history
    private void saveStatusHistory(Complaint complaint, String status, String remark, User updatedBy) {
        StatusHistory history = new StatusHistory();
        history.setComplaint(complaint);
        history.setStatus(status);
        history.setRemark(remark);
        history.setUpdatedBy(updatedBy);
        statusHistoryRepository.save(history);
    }

    // Public stats for dashboard
    public java.util.Map<String, Long> getStats() {
        return java.util.Map.of(
            "total", complaintRepository.count(),
            "pending", complaintRepository.countByStatus(Complaint.Status.PENDING),
            "resolved", complaintRepository.countByStatus(Complaint.Status.RESOLVED),
            "inProgress", complaintRepository.countByStatus(Complaint.Status.IN_PROGRESS)
        );
    }
}