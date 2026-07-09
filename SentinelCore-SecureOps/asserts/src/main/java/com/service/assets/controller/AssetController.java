package com.service.assets.controller;

import com.service.assets.model.Asset;
import com.service.assets.service.AssetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/assets")
@CrossOrigin(origins = "http://localhost:5173")
public class AssetController {

    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Asset> registerAsset(@RequestBody Asset asset) {
        Asset created = assetService.createAsset(asset);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Asset>> getInventoryDashboard() {
        List<Asset> assets = assetService.getAllAssets();
        return ResponseEntity.ok(assets);
    }

    @GetMapping("/find")
    public ResponseEntity<List<Asset>> getAssetsByIp(@RequestParam String prefix){
        List<Asset> assets = assetService.getAllByIpPrefix(prefix);
        return ResponseEntity.ok(assets);
    }
}
