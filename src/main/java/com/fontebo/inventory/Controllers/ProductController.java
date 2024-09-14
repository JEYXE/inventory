package com.fontebo.inventory.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import com.fontebo.inventory.Models.Product;
import com.fontebo.inventory.Records.ProductCreationRecord;
import com.fontebo.inventory.Records.ProductListRecord;
import com.fontebo.inventory.Repositories.ProductRepository;
import com.fontebo.inventory.Services.ProductService;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    @PostMapping
    public ResponseEntity createProduct(@Validated @RequestBody ProductCreationRecord productCreationRecord) {
        System.out.println(productCreationRecord);
        var createdProduct = productService.createProduct(productCreationRecord);
        return ResponseEntity.ok(createdProduct);
    }

    @GetMapping
    public ResponseEntity<List<ProductListRecord>> getAllProducts() {
        List<ProductListRecord> products = productRepository.findAll()
                .stream()
                .map(ProductListRecord::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(products);
    }

    // Otros métodos para editar y eliminar productos
}