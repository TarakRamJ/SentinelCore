package com.service.assets.repo;

import com.service.assets.model.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, UUID> {
    // Additional custom metric filtering queries can go here if needed later
}