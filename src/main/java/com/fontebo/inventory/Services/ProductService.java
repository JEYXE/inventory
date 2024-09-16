package com.fontebo.inventory.Services;


import java.util.Optional;

import org.hibernate.cache.spi.support.AbstractReadWriteAccess.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.fontebo.inventory.Exceptions.CategoriaDuplicadaException;
import com.fontebo.inventory.Exceptions.ProductoDupicladoException;
import com.fontebo.inventory.Models.Category;
import com.fontebo.inventory.Models.Product;
import com.fontebo.inventory.Records.ProductCreationRecord;
import com.fontebo.inventory.Records.ProductListRecord;
import com.fontebo.inventory.Repositories.CategoryRepository;
import com.fontebo.inventory.Repositories.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CategoryRepository categoryRepository;

    public ProductListRecord createProduct(ProductCreationRecord productRecord) {
        Optional<Product> ProductoExistente = productRepository.findByName(productRecord.name());
        if (ProductoExistente.isPresent()) {
             throw new ProductoDupicladoException("No se permiten duplicados");
        } else {
            var name=productRecord.name();
            var description=productRecord.description();
            var measureUnit=productRecord.measureUnit();
            var category=categoryRepository.findById(productRecord.categoryId()).get();
            var product= new Product(name, description, measureUnit,category);
            productRepository.save(product);
            return new ProductListRecord(product);
        }

        
    }
    public Page<ProductListRecord> getItems(Pageable pageable) {
        return productRepository.findAll(pageable).map(ProductListRecord::new);
    }

  



    // Otros métodos para editar y eliminar productos
}