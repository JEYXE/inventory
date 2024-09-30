package com.fontebo.inventory.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.fontebo.inventory.Models.Movement;

@Repository
public interface MovementRepository extends JpaRepository<Movement, Long>{

    Page<Movement> findByProductId(Pageable pageable, Long productId);

}
