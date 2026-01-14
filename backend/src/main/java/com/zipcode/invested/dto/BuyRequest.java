package com.zipcode.invested.dto;

import java.math.BigDecimal;

public class BuyRequest {
    
    private String symbol;
    private String assetName;
    private String assetType; // "STOCK" or "CRYPTO"
    private BigDecimal quantity;
    private BigDecimal currentPrice;
    
    // Constructors
    public BuyRequest() {}
    
    public BuyRequest(String symbol, String assetName, String assetType, 
                      BigDecimal quantity, BigDecimal currentPrice) {
        this.symbol = symbol;
        this.assetName = assetName;
        this.assetType = assetType;
        this.quantity = quantity;
        this.currentPrice = currentPrice;
    }
    
    // Getters and Setters
    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }
    
    public String getAssetName() { return assetName; }
    public void setAssetName(String assetName) { this.assetName = assetName; }
    
    public String getAssetType() { return assetType; }
    public void setAssetType(String assetType) { this.assetType = assetType; }
    
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    
    public BigDecimal getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; }
}