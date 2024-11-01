package com.fontebo.inventory.Services;

import java.time.LocalDateTime;

import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.fontebo.inventory.Models.AuditLog;
import com.fontebo.inventory.Repositories.AuditLogRepository;

@Aspect
@Component
public class AuditAspect {
    @Autowired
    private AuditLogRepository auditLogRepository;

    @AfterReturning("execution(* com.fontebo.inventory.*.*(..))")
    public void logAfterMethodCall() {
        System.out.println("aca toy");
        AuditLog auditLog = new AuditLog();
        auditLog.setUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        auditLog.setTimestamp(LocalDateTime.now());
        auditLog.setEndpoint("endpoint"); // Aquí puedes obtener el endpoint real
        auditLogRepository.save(auditLog);
    }
}
