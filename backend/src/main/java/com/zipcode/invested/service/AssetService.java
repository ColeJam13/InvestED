package com.zipcode.invested.service;

import com.zipcode.invested.asset.Asset;
import com.zipcode.invested.asset.AssetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AssetService {

    private final AssetRepository assetRepository;

    public AssetService(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    public List<Asset> findAll() {
        return assetRepository.findAll();
    }

    public Optional<Asset> findById(Long id) {
        return assetRepository.findById(id);
    }

    public Optional<Asset> findBySymbolAndAssetType(String symbol, String assetType) {
        return assetRepository.findBySymbolAndAssetType(symbol, assetType);
    }

    public Asset save(Asset asset) {
        return assetRepository.save(asset);
    }
}