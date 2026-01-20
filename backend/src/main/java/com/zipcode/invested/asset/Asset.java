package com.zipcode.invested.asset;

import jakarta.persistence.*;

@Entity
@Table(
        name = "asset",
        uniqueConstraints = @UniqueConstraint(name = "uk_asset_symbol_type", columnNames = {"symbol", "asset_type"})
)
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String symbol;

    @Column(nullable = false, length = 120)
    private String name;   

    @Column(name = "asset_type", nullable = false, length = 30)
    private String assetType;

    protected Asset() {}

    public Asset(String symbol, String name, String assetType) {
        this.symbol = symbol;
        this.name = name;
        this.assetType = assetType;
    }

    public Long getId() { return id; }
    public String getSymbol() { return symbol; }
    public String getName() { return name; }
    public String getAssetType() { return assetType; }

    public void setSymbol(String symbol) { this.symbol = symbol; }
    public void setName(String name) { this.name = name; }
    public void setAssetType(String assetType) { this.assetType = assetType; }
}
