package com.fontebo.inventory.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/api/movements")
public class MovementController {

    @Autowired
    private MovementRepository movementRepository;

}
