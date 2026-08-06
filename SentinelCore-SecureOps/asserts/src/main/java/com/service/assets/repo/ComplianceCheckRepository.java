package com.service.assets.repo;

import com.service.assets.model.ComplianceCheck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ComplianceCheckRepository extends JpaRepository<ComplianceCheck, Long> {
    Optional<ComplianceCheck> findByFramework(String framework);
}