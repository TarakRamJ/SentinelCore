package com.service.asserts.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "alerts")
public class Alert {
    @Id
    private UUID alertId;

    @Column(name = "asset_id", nullable = false)
    private UUID assetId;

    @Column(name = "metric_name", nullable = false)
    private String metricName;

    @Column(name = "violation_value")
    private float violationValue;

    @Column(name = "solution")
    private String solution;

    @Column(name = "server_type")
    private String serverType;

    @Column(name = "server_name")
    private String serverName;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "severity", nullable = false)
    private AlertSeverity severity;

    private boolean resolved;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    public enum AlertSeverity { LOW, MEDIUM, HIGH, CRITICAL }

    public Alert() {}

    public Alert(UUID assetId, String metricName, float violationValue, AlertSeverity severity) {
        this.alertId = UUID.randomUUID();
        this.assetId = assetId;
        this.metricName = metricName;
        this.violationValue = violationValue;
        this.severity = severity;
        this.resolved = false;
        this.createdAt = OffsetDateTime.now();
    }

    public Alert(UUID assetId, String metricName, float violationValue, String solution, String serverType, String serverName, AlertSeverity severity) {
        this.alertId = UUID.randomUUID();
        this.assetId = assetId;
        this.metricName = metricName;
        this.violationValue = violationValue;
        this.solution = solution;
        this.serverType = serverType;
        this.serverName = serverName;
        this.severity = severity;
        this.resolved = false;
        this.createdAt = OffsetDateTime.now();
    }

    // Getters and Setters
    public UUID getAlertId() { return alertId; }
    public UUID getAssetId() { return assetId; }
    public String getMetricName() { return metricName; }
    public float getViolationValue() { return violationValue; }
    public String getSolution() { return solution; }
    public void setSolution(String solution) { this.solution = solution; }
    public String getServerType() { return serverType; }
    public void setServerType(String serverType) { this.serverType = serverType; }
    public String getServerName() { return serverName; }
    public void setServerName(String serverName) { this.serverName = serverName; }
    public AlertSeverity getSeverity() { return severity; }
    public boolean isResolved() { return resolved; }
    public void setResolved(boolean resolved) { this.resolved = resolved; }
}
