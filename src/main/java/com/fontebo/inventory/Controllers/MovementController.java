package com.fontebo.inventory.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fontebo.inventory.Records.MovementCreationRecord;
import com.fontebo.inventory.Records.MovementListRecord;
import com.fontebo.inventory.Services.MovementService;

import jakarta.transaction.Transactional;




@RestController
@RequestMapping("/api/movements")
public class MovementController {
    @Autowired
    private MovementService movementService;

    @PostMapping
    @Transactional
    public ResponseEntity<MovementListRecord> createMovement(@Validated @RequestBody MovementCreationRecord movement) {
        var createdMovement = movementService.createMovement(movement);
        return ResponseEntity.ok(createdMovement);
    }

    @GetMapping
    public ResponseEntity<Page<MovementListRecord>> getMovement(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(movementService.getItems(PageRequest.of(page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Page<MovementListRecord>> getMovementByProduct(
        @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(movementService.getItemsByProduct(PageRequest.of(page, size),id));
    }

}
