package com.service.assets.controller;

import com.service.assets.dto.ComplianceSummaryDTO;
import com.service.assets.model.AuditLog;
import com.service.assets.service.AuditComplianceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuditComplianceController {

    private final AuditComplianceService auditComplianceService;

    public AuditComplianceController(AuditComplianceService auditComplianceService) {
        this.auditComplianceService = auditComplianceService;
    }

    @GetMapping("/audit/logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditComplianceService.getAllAuditLogs());
    }

    @GetMapping("/compliance/summary")
    public ResponseEntity<ComplianceSummaryDTO> getComplianceSummary() {
        return ResponseEntity.ok(auditComplianceService.getComplianceSummary());
    }

    @PostMapping("/audit/log")
    public ResponseEntity<AuditLog> createAuditLog(
            @RequestParam String email,
            @RequestParam String action,
            @RequestParam String resource,
            @RequestParam(defaultValue = "N/A") String targetId,
            @RequestParam(defaultValue = "System Target") String targetName,
            @RequestParam String status,
            @RequestParam(defaultValue = "127.0.0.1") String ip) {
        return ResponseEntity.ok(auditComplianceService.logAction(email, action, resource, targetId, targetName, status, ip));
    }
}