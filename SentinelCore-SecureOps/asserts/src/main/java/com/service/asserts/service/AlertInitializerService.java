package com.service.asserts.service;

import com.service.asserts.model.Alert;
import com.service.asserts.model.Asset;
import com.service.asserts.repo.AlertRepository;
import com.service.asserts.repo.AssetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class AlertInitializerService implements CommandLineRunner {

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private AssetRepository assetRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only initialize if no alerts exist
        if (alertRepository.count() == 0) {
            initializeSampleAlerts();
        }
    }

    private void initializeSampleAlerts() {
        try {
            // Create some sample assets first if they don't exist
            Asset dbServer = new Asset(
                UUID.fromString("a1234567-b234-c567-d890-e12345678901"),
                "DB-SRV-12",
                Asset.AssetType.SERVER,
                Asset.HealthStatus.CRITICAL
            );

            Asset appServer = new Asset(
                UUID.fromString("b2345678-c345-d678-e901-f23456789012"),
                "APP-SRV-47",
                Asset.AssetType.SERVER,
                Asset.HealthStatus.WARNING
            );

            Asset webServer = new Asset(
                UUID.fromString("c3456789-d456-e789-f012-123456789abc"),
                "WEB-SRV-05",
                Asset.AssetType.SERVER,
                Asset.HealthStatus.WARNING
            );

            assetRepository.save(dbServer);
            assetRepository.save(appServer);
            assetRepository.save(webServer);

            // Create sample alerts
            Alert alert1 = new Alert(
                dbServer.getAssetId(),
                "CPU",
                94.0f,
                "Auto-scaled",
                "DB-SRV",
                "12",
                Alert.AlertSeverity.CRITICAL
            );

            Alert alert2 = new Alert(
                appServer.getAssetId(),
                "Disk",
                91.0f,
                "Cleanup scheduled",
                "APP-SRV",
                "47",
                Alert.AlertSeverity.HIGH
            );

            Alert alert3 = new Alert(
                webServer.getAssetId(),
                "Memory",
                78.0f,
                "Restart initiated",
                "WEB-SRV",
                "05",
                Alert.AlertSeverity.HIGH
            );
            
            alert3.setResolved(false);

            alertRepository.save(alert1);
            alertRepository.save(alert2);
            alertRepository.save(alert3);

            System.out.println("✓ Sample alerts initialized successfully");
        } catch (Exception e) {
            System.err.println("Error initializing alerts: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
