package com.zipcode.invested.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.zipcode.invested.service.CoinMarketCapService;
import com.zipcode.invested.service.FinnhubService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/market")
public class MarketDataController {

    private final FinnhubService finnhubService;
    private final CoinMarketCapService coinMarketCapService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public MarketDataController(FinnhubService finnhubService, CoinMarketCapService coinMarketCapService) {
        this.finnhubService = finnhubService;
        this.coinMarketCapService = coinMarketCapService;
    }

    @GetMapping("/search")
    public ResponseEntity<String> searchAssets(
            @RequestParam String query,
            @RequestParam(defaultValue = "stock") String type
    ) {
        try {
            ObjectNode responseNode = objectMapper.createObjectNode();
            ArrayNode results = objectMapper.createArrayNode();

            if (type.equalsIgnoreCase("crypto")) {
                try {
                    String cryptoResults = coinMarketCapService.searchCrypto(query.toUpperCase());
                    JsonNode cryptoNode = objectMapper.readTree(cryptoResults);

                    if (cryptoNode.has("data") && cryptoNode.get("data").isArray()) {
                        ArrayNode cryptoArray = (ArrayNode) cryptoNode.get("data");

                        int count = 0;
                        for (JsonNode crypto : cryptoArray) {
                            if (crypto.has("rank")
                                    && !crypto.get("rank").isNull()
                                    && crypto.get("rank").asInt() <= 1000) {

                                ObjectNode cryptoResult = objectMapper.createObjectNode();
                                cryptoResult.put("symbol", "CRYPTO:" + crypto.get("symbol").asText());
                                cryptoResult.put("instrument_name", crypto.get("name").asText());
                                cryptoResult.put("instrument_type", "Crypto");
                                cryptoResult.put("displaySymbol", crypto.get("symbol").asText());
                                cryptoResult.put("cmcId", crypto.get("id").asInt());
                                results.add(cryptoResult);

                                count++;
                                if (count >= 5) break;
                            }
                        }
                    }
                } catch (Exception ignored) {
                }
            } else {
                String stockResults = finnhubService.searchSymbol(query);
                JsonNode stockNode = objectMapper.readTree(stockResults);
                ArrayNode stockArray = (ArrayNode) stockNode.get("result");

                for (JsonNode stock : stockArray) {
                    results.add(stock);
                }
            }

            responseNode.put("count", results.size());
            responseNode.set("result", results);

            return ResponseEntity.ok(objectMapper.writeValueAsString(responseNode));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Search failed: " + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/quote")
    public ResponseEntity<String> getQuote(@RequestParam String symbol) {
        try {
            if (symbol.startsWith("CRYPTO:")) {
                String cryptoSymbol = symbol.substring(7); 
                String cryptoQuote = coinMarketCapService.getCryptoQuote(cryptoSymbol);

                JsonNode cmcData = objectMapper.readTree(cryptoQuote);
                JsonNode cryptoData = cmcData.path("data").path(cryptoSymbol).get(0);
                JsonNode quote = cryptoData.path("quote").path("USD");

                ObjectNode finnhubFormat = objectMapper.createObjectNode();
                finnhubFormat.put("c", quote.path("price").asDouble());
                finnhubFormat.put("h", quote.path("price").asDouble());
                finnhubFormat.put("l", quote.path("price").asDouble());
                finnhubFormat.put("o", quote.path("price").asDouble());
                finnhubFormat.put("pc",
                        quote.path("price").asDouble()
                                - (quote.path("price").asDouble() * quote.path("percent_change_24h").asDouble() / 100)
                );
                finnhubFormat.put("dp", quote.path("percent_change_24h").asDouble());

                return ResponseEntity.ok(objectMapper.writeValueAsString(finnhubFormat));
            }

            String quote = finnhubService.getQuote(symbol);
            return ResponseEntity.ok(quote);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to fetch quote: " + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/quote/crypto")
    public ResponseEntity<String> getCryptoQuote(@RequestParam String symbol) {
        try {
            String quote = coinMarketCapService.getCryptoQuote(symbol);
            return ResponseEntity.ok(quote);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to fetch crypto quote: " + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/trending")
    public ResponseEntity<String> getTrending() {
        try {
            String trending = finnhubService.getTrendingQuotes();
            return ResponseEntity.ok(trending);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to fetch trending: " + e.getMessage() + "\"}");
        }
    }
}
