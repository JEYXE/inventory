package com.fontebo.inventory.Records;

import java.time.LocalDateTime;
import com.fontebo.inventory.Models.MovementType;

public record MovementCreationRecord(LocalDateTime movementDate, Long productId, int quantity, MovementType movementType) {

}
