package com.fontebo.inventory.Controllers;

import org.hibernate.cache.spi.support.AbstractReadWriteAccess.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
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
        public ResponseEntity<Page<ProductListRecord>> getItems(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(productService.getItems(PageRequest.of(page, size)));
    }
   

    // Otros métodos para editar y eliminar productos
}