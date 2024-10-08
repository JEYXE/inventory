package com.fontebo.inventory.Controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.fontebo.inventory.Records.ProductCreationRecord;
import com.fontebo.inventory.Records.ProductListRecord;
import com.fontebo.inventory.Records.ProductUpdateRecord;
import com.fontebo.inventory.Services.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping
    public ResponseEntity<ProductListRecord> createProduct(
            @Validated @RequestBody ProductCreationRecord productCreationRecord) {
        var createdProduct = productService.createProduct(productCreationRecord);
        return ResponseEntity.ok(createdProduct);
    }

    @GetMapping
    public ResponseEntity<?> getItems(
            @RequestParam(required = false) Integer  page,
            @RequestParam(required = false) Integer  size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {
        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        if (page == null || size == null) {
            // Si no se proporcionan parámetros de paginación, devolver todos los elementos
            List<ProductListRecord> allItems = productService.getAllItems(sort);
            return ResponseEntity.ok(allItems);
        } else {
            // Si se proporcionan parámetros de paginación, devolver la página solicitada
            Page<ProductListRecord> pagedItems = productService.getItems(PageRequest.of(page, size, sort));
            return ResponseEntity.ok(pagedItems);
        }
        
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductListRecord> obtenerProductoPorId(@PathVariable Long id) {
        var producto = productService.getProductById(id);
        return ResponseEntity.ok(producto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        boolean isRemoved = productService.deleteUserById(id);
        if (!isRemoved) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductListRecord> updateProduct(@PathVariable Long id,
            @RequestBody ProductUpdateRecord product) {
        var updateProduct = productService.updateProduct(id, product);
        return ResponseEntity.ok(updateProduct);
    }
    // Otros métodos para editar y eliminar productos
}