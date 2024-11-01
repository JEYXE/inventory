package com.fontebo.inventory.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fontebo.inventory.Models.AuditLog;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}

