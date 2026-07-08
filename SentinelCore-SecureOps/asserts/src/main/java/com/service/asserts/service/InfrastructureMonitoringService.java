package com.service.asserts.service;

import com.service.asserts.model.Alert;
import com.service.asserts.model.Asset;
import com.service.asserts.model.PerformanceMetric;
import com.service.asserts.repo.AlertRepository;
import com.service.asserts.repo.AssetRepository;
import com.service.asserts.repo.PerformanceMetricRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class InfrastructureMonitoringService {

    private final AssetRepository assetRepository;
    private final PerformanceMetricRepository metricRepository;
    private final AlertRepository alertRepository;
    private final Random random = new Random();

    public InfrastructureMonitoringService(AssetRepository assetRepository,
                                           PerformanceMetricRepository metricRepository,
                                           AlertRepository alertRepository) {
        this.assetRepository = assetRepository;
        this.metricRepository = metricRepository;
        this.alertRepository = alertRepository;
    }

    // Core CRUD Management
    @Transactional
    public Asset createAsset(Asset asset) {
        if (asset.getAssetId() == null) {
            asset.setAssetId(UUID.randomUUID());
        }
        asset.setStatus(Asset.HealthStatus.HEALTHY);
        return assetRepository.save(asset);
    }

    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    // Background Engine: Simulated Metric Scraping every 10 seconds
    @Scheduled(fixedRate = 2000)
    @Transactional
    public void scrapeInfrastructureTelemetry() {
        List<Asset> assets = assetRepository.findAll();

        // Seed initial mock assets if DB is empty to meet the scale criteria
        if (assets.isEmpty()) {
            seedMockAssets();
            return;
        }

        for (Asset asset : assets) {
            // Generate telemetry payload
            float cpu = random.nextFloat() * 100;
            float memory = random.nextFloat() * 100;
            float disk = random.nextFloat() * 100;
            float network = random.nextFloat() * 100;
            Optional<PerformanceMetric> existingMetric =
                    metricRepository.findByAssetId(asset.getAssetId());

            PerformanceMetric metric;

            if(existingMetric.isPresent()){

                metric = existingMetric.get();

                metric.setCpuUsage(cpu);
                metric.setMemoryUsage(memory);
                metric.setDiskUsage(disk);
                metric.setNetworkUsage(network);
                metric.setTimestamp(OffsetDateTime.now());

            }else{

                metric = new PerformanceMetric(
                        asset.getAssetId(),
                        cpu,
                        memory,
                        disk,
                        network);

            }

            metricRepository.save(metric);
            // Process rules engine evaluation
            evaluateRulesAndHealth(asset, metric);
        }
    }

    private void evaluateRulesAndHealth(Asset asset, PerformanceMetric metric) {
        Asset.HealthStatus targetStatus = Asset.HealthStatus.HEALTHY;

        // Check Threshold Boundaries
        targetStatus = checkMetricThreshold(asset, "CPU", metric.getCpuUsage(), targetStatus);
        targetStatus = checkMetricThreshold(asset, "Memory", metric.getMemoryUsage(), targetStatus);
        targetStatus = checkMetricThreshold(asset, "Disk", metric.getDiskUsage(), targetStatus);

        // If rules state changed, update the Asset asset tracking layer
        if (asset.getStatus() != targetStatus) {
            asset.setStatus(targetStatus);
            asset.setUpdatedAt(OffsetDateTime.now());
            assetRepository.save(asset);
        }
    }

    private Asset.HealthStatus checkMetricThreshold(Asset asset, String metricName, float value, Asset.HealthStatus currentEvaluatedStatus) {
        Asset.HealthStatus nextStatus = currentEvaluatedStatus;

        if (value >= 90.0f) { // Critical Breach Threshold
            nextStatus = Asset.HealthStatus.CRITICAL;
            triggerAlertIfNew(asset.getAssetId(), metricName, value, Alert.AlertSeverity.CRITICAL);
        } else if (value >= 75.0f) { // Warning Breach Threshold
            if (nextStatus != Asset.HealthStatus.CRITICAL) {
                nextStatus = Asset.HealthStatus.WARNING;
            }
            triggerAlertIfNew(asset.getAssetId(), metricName, value, Alert.AlertSeverity.HIGH);
        } else {
            // Auto-resolve mechanism if metric drops back down
            resolveAlertsIfAny(asset.getAssetId(), metricName);
        }
        return nextStatus;
    }

    private void triggerAlertIfNew(UUID assetId, String metricName, float value, Alert.AlertSeverity severity) {
        List<Alert> activeAlerts = alertRepository.findByAssetIdAndResolvedFalse(assetId);
        boolean alreadyFired = activeAlerts.stream().anyMatch(a -> a.getMetricName().equalsIgnoreCase(metricName));

        if (!alreadyFired) {
            maintainAlertLimit();
            Alert alert = new Alert(assetId, metricName, value, severity);
            alertRepository.save(alert);
            // System design extension: Publish event to Apache Kafka here
        }
    }

    private void resolveAlertsIfAny(UUID assetId, String metricName) {
        List<Alert> activeAlerts = alertRepository.findByAssetIdAndResolvedFalse(assetId);
        activeAlerts.stream()
                .filter(a -> a.getMetricName().equalsIgnoreCase(metricName))
                .forEach(a -> {
                    a.setResolved(true);
                    alertRepository.save(a);
                });
    }

    private void seedMockAssets() {
        // Generates sample operational assets matching standard deployment models
        assetRepository.save(new Asset(UUID.randomUUID(), "DB-SRV-12", Asset.AssetType.SERVER, Asset.HealthStatus.HEALTHY));
        assetRepository.save(new Asset(UUID.randomUUID(), "APP-SRV-47", Asset.AssetType.SERVER, Asset.HealthStatus.HEALTHY));
        assetRepository.save(new Asset(UUID.randomUUID(), "AWS-EC2-K8S-NODE", Asset.AssetType.CLOUD_AWS, Asset.HealthStatus.HEALTHY));
    }
    private void maintainAlertLimit() {

        long totalAlerts = alertRepository.count();

        if (totalAlerts >= 70) {

            List<Alert> alerts = alertRepository.findAllByOrderByCreatedAtAsc();

            alertRepository.delete(alerts.get(0));   // Delete oldest alert
        }
    }
}