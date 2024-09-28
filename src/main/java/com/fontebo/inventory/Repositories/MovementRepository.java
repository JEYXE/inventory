package com.fontebo.inventory.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fontebo.inventory.Models.Movement;

@Repository
public interface MovementRepository extends JpaRepository<Movement, Long>{

}
