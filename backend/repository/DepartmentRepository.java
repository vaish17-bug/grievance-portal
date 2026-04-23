package com.grievance.backend.repository;

import com.grievance.backend.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    // JpaRepository gives us findAll(), findById(), save(), delete() for free
}