package com.service.assets.service;

import com.service.assets.dto.ComplianceSummaryDTO;
import com.service.assets.model.AuditLog;
import com.service.assets.model.ComplianceCheck;
import com.service.assets.repo.*;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditComplianceService {

    private final AuditLogRepository auditLogRepository;
    private final ComplianceCheckRepository complianceCheckRepository;
    private final IncidentRepository incidentRepository;
    private final VulnerabilityRepository vulnerabilityRepository;

    public AuditComplianceService(
            AuditLogRepository auditLogRepository,
            ComplianceCheckRepository complianceCheckRepository,
            IncidentRepository incidentRepository,
            VulnerabilityRepository vulnerabilityRepository) {
        this.auditLogRepository = auditLogRepository;
        this.complianceCheckRepository = complianceCheckRepository;
        this.incidentRepository = incidentRepository;
        this.vulnerabilityRepository = vulnerabilityRepository;
    }

//    @PostConstruct
//    public void initData() {
//        if (complianceCheckRepository.count() == 0) {
//            complianceCheckRepository.save(new ComplianceCheck("PCI DSS", "COMPLIANT", 100, 240, 240));
//            complianceCheckRepository.save(new ComplianceCheck("SOC 2", "COMPLIANT", 100, 150, 150));
//            complianceCheckRepository.save(new ComplianceCheck("ISO 27001", "COMPLIANT", 100, 114, 114));
//        }
//
//        if (auditLogRepository.count() == 0) {
//            auditLogRepository.save(new AuditLog("admin@sentinel.com", "User Login", "Authentication", "User: admin@sentinel.com", "SUCCESS", "192.168.1.10"));
//            auditLogRepository.save(new AuditLog("admin@sentinel.com", "Asset Created", "Asset Management", "DB-SRV-01 (ID #101)", "SUCCESS", "192.168.1.10"));
//            auditLogRepository.save(new AuditLog("sec_admin@sentinel.com", "Incident Assigned", "Incident Management", "Failed Login Attempts (INC-2024-1247)", "SUCCESS", "192.168.1.12"));
//            auditLogRepository.save(new AuditLog("sec_admin@sentinel.com", "Patch Applied", "Vulnerability Management", "CVE-2024-1234 (CVSS 9.8)", "SUCCESS", "192.168.1.12"));
//            auditLogRepository.save(new AuditLog("auditor@sentinel.com", "Compliance Check Completed", "Compliance", "PCI DSS Framework", "SUCCESS", "192.168.1.15"));
//            auditLogRepository.save(new AuditLog("unknown@external.com", "Failed Login", "Authentication", "User: admin", "FAILED", "192.168.1.247"));
//        }
//    }

    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }

    public AuditLog logAction(String email, String action, String resource, String tId, String tName, String status, String ip) {
        return auditLogRepository.save(new AuditLog(email, action, resource, tId,tName, status, ip));
    }

    public ComplianceSummaryDTO getComplianceSummary() {
        long realAuditCount = auditLogRepository.count();

        long criticalIncidents = incidentRepository.findAll().stream()
                .filter(i -> "CRITICAL".equalsIgnoreCase(i.getSeverity().name()) && !"RESOLVED".equalsIgnoreCase(i.getStatus().name()))
                .count();

        long unpatchedCriticalVulns = vulnerabilityRepository.findAll().stream()
                .filter(v -> "CRITICAL".equalsIgnoreCase(v.getSeverity().name()) && !"PATCHED".equalsIgnoreCase(v.getPatchStatus().name()))
                .count();

        int activeViolations = (int) (criticalIncidents + unpatchedCriticalVulns);
        int complianceRate = activeViolations == 0 ? 100 : Math.max(50, 100 - (activeViolations * 10));

        updateComplianceCheck("PCI DSS", complianceRate, 240);
        updateComplianceCheck("SOC 2", complianceRate, 150);
        updateComplianceCheck("ISO 27001", complianceRate, 114);

        List<ComplianceCheck> checks = complianceCheckRepository.findAll();

        String sonarStatus = unpatchedCriticalVulns == 0 ? "0 Critical Vulnerabilities" : unpatchedCriticalVulns + " Critical Vulnerabilities";
        String owaspStatus = activeViolations == 0 ? "PASSED" : "FAILED_NEEDS_REMEDIATION";

        return new ComplianceSummaryDTO(realAuditCount, complianceRate + "%", activeViolations, sonarStatus, owaspStatus, checks);
    }

    private void updateComplianceCheck(String framework, int score, int totalControls) {
        int passed = (int) Math.round((score / 100.0) * totalControls);
        ComplianceCheck check = complianceCheckRepository.findByFramework(framework)
                .orElse(new ComplianceCheck(framework, score == 100 ? "COMPLIANT" : "NON_COMPLIANT", score, totalControls, passed));

        check.setScorePercentage(score);
        check.setStatus(score == 100 ? "COMPLIANT" : "NON_COMPLIANT");
        check.setPassedControls(passed);
        check.setLastScanned(LocalDateTime.now());

        complianceCheckRepository.save(check);
    }
}