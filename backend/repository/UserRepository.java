package com.grievance.backend.repository;

import com.grievance.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    // Spring auto-generates: SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);

    // Get all workers
    List<User> findByRole(User.Role role);
}