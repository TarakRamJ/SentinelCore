package com.service.asserts.repo;

import com.service.asserts.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AlertRepository extends JpaRepository<Alert, UUID> {
    List<Alert> findByAssetIdAndResolvedFalse(UUID assetId);
    List<Alert> findAllByOrderByCreatedAtAsc();
    long count();
}