package com.fontebo.inventory.Records;

import java.time.LocalDateTime;

import com.fontebo.inventory.Models.Movement;
import com.fontebo.inventory.Models.MovementType;

public record MovementListRecord(Long id, String productName, MovementType movementType, int quantity,
        LocalDateTime movementDate) {
    public MovementListRecord(Movement movement) {
        this(movement.getId(), movement.getProduct().getName(), movement.getMovementType(), movement.getQuantity(),
                movement.getMovementDate());

    }
}
