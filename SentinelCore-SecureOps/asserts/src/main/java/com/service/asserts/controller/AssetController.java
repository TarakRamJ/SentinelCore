package com.service.asserts.controller;

import com.service.asserts.model.Asset;
import com.service.asserts.service.InfrastructureMonitoringService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/assets")
@CrossOrigin(origins = "http://localhost:5173") // Update to specific frontend domains for production
public class AssetController {

    private final InfrastructureMonitoringService monitoringService;

    public AssetController(InfrastructureMonitoringService monitoringService) {
        this.monitoringService = monitoringService;
    }

    @PostMapping
    public ResponseEntity<Asset> registerAsset(@RequestBody Asset asset) {
        Asset created = monitoringService.createAsset(asset);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Asset>> getInventoryDashboard() {
        List<Asset> assets = monitoringService.getAllAssets();
        return ResponseEntity.ok(assets);
    }
}
