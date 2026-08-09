package com.service.assets.repo;

import com.service.assets.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findAllByOrderByTimestampDesc();
    List<AuditLog> findTop5ByOrderByTimestampDesc();
    List<AuditLog> findByUserEmailAndTimestampGreaterThanEqualOrderByTimestampAsc(
            String userEmail, LocalDateTime start);
}