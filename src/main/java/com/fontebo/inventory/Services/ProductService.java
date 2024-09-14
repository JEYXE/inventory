package com.fontebo.inventory.Services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


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
        var name=productRecord.name();
        var description=productRecord.description();
        var measureUnit=productRecord.measureUnit();
        var category=categoryRepository.findById(productRecord.categoryId()).get();
        var product= new Product(name, description, measureUnit,category);
        productRepository.save(product);
        return new ProductListRecord(product);
    }

  



    // Otros métodos para editar y eliminar productos
}