package com.fontebo.inventory.Records;

import com.fontebo.inventory.Models.MeasureUnit;

import jakarta.validation.constraints.NotBlank;

public record ProductUpdateRecord(
        @NotBlank(message = "El nombre no puede ser vacío") String name,
        String description,
        @NotBlank(message = "La unidad de medida no puede ser vacío") MeasureUnit measureUnit,
        @NotBlank(message = "La categoria no puede ser vacío") Long categoryId) {

}
