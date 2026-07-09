package com.service.assets.service;

import com.service.assets.model.Asset;
import com.service.assets.repo.AssetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AssetService {

    private AssetRepository assetRepository;

    public AssetService(AssetRepository assetRepository){
        this.assetRepository=assetRepository;
    }

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

    public List<Asset> getAllByIpPrefix(String prefix){
        return assetRepository.findByIpPrefix(prefix);
    }
}
