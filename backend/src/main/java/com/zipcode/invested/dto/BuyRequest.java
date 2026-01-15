package com.zipcode.invested.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class BuyRequest {

    @NotBlank(message = "symbol is required")
    private String symbol;

    @NotBlank(message = "assetName is required")
    private String assetName;

    @NotBlank(message = "assetType is required")
    private String assetType;

    @NotNull(message = "quantity is required")
    @Positive(message = "quantity must be greater than 0")
    private BigDecimal quantity;

    private BigDecimal currentPrice;

    public BuyRequest() {}

    public BuyRequest(
            String symbol,
            String assetName,
            String assetType,
            BigDecimal quantity,
            BigDecimal currentPrice
    ) {
        this.symbol = symbol;
        this.assetName = assetName;
        this.assetType = assetType;
        this.quantity = quantity;
        this.currentPrice = currentPrice;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getAssetName() {
        return assetName;
    }

    public void setAssetName(String assetName) {
        this.assetName = assetName;
    }

    public String getAssetType() {
        return assetType;
    }

    public void setAssetType(String assetType) {
        this.assetType = assetType;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
    }
}
