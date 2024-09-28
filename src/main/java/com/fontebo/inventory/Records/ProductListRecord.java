package com.fontebo.inventory.Records;

import com.fontebo.inventory.Models.MeasureUnit;
import com.fontebo.inventory.Models.Product;

public record ProductListRecord(Long id, String name, String description, MeasureUnit measureUnit, String category,
        int quantity) {
    public ProductListRecord(Product product) {
        this(product.getId(), product.getName(), product.getDescription(), product.getMeasureUnit(),
                product.getCategory().getName(), product.getQuantity());

    }

}
