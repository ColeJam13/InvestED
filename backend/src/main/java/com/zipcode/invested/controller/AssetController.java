package com.zipcode.invested.controller;

import com.zipcode.invested.asset.Asset;
import com.zipcode.invested.service.AssetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @GetMapping
    public List<Asset> getAll() {
        return assetService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Asset> getById(@PathVariable Long id) {
        return assetService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Asset> create(@RequestBody Asset asset) {
        Asset saved = assetService.save(asset);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
