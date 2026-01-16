package com.zipcode.invested.asset;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AssetRepository extends JpaRepository<Asset, Long> {

    Optional<Asset> findBySymbolAndAssetType(String symbol, String assetType);
}
