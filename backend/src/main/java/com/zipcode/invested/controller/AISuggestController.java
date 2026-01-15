package com.zipcode.invested.controller;

import com.zipcode.invested.dto.AISuggestRequest;
import com.zipcode.invested.dto.AISuggestResponse;
import com.zipcode.invested.service.AISuggestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AISuggestController {

    private final AISuggestService aiSuggestService;

    public AISuggestController(AISuggestService aiSuggestService) {
        this.aiSuggestService = aiSuggestService;
    }

    @PostMapping("/suggest")
    public ResponseEntity<AISuggestResponse> suggest(@RequestBody AISuggestRequest request) {
        try {
            return ResponseEntity.ok(aiSuggestService.suggest(request));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
