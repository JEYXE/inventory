package com.fontebo.inventory.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fontebo.inventory.Models.Product;

public interface MovementRepository extends JpaRepository<Product, Long>{

}
