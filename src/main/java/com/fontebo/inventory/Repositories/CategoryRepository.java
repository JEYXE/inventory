package com.fontebo.inventory.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fontebo.inventory.Models.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // Métodos adicionales si es necesario
}

