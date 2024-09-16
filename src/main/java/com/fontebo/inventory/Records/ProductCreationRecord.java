package com.fontebo.inventory.Records;

import com.fontebo.inventory.Models.MeasureUnit;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProductCreationRecord(
        @NotBlank(message = "El nombre no puede ser vacío")
        @NotNull(message = "El nombre es obligatorio")
        String name,
        String description,
        @NotNull(message = "La unidad de medida es obligatoria")
        MeasureUnit measureUnit,
        @NotNull(message = "La unidad de medida es obligatoria")
        Long categoryId) {
    
}
