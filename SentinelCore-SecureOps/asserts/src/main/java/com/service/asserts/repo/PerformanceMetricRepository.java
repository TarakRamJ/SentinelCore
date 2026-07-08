package com.service.asserts.repo;

import com.service.asserts.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface PerformanceMetricRepository extends JpaRepository<PerformanceMetric, UUID> {
    Optional<PerformanceMetric> findByAssetId(UUID assetId);

}