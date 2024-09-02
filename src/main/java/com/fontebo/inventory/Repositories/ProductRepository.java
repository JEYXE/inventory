package com.fontebo.inventory.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fontebo.inventory.Models.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Métodos adicionales si es necesario
}