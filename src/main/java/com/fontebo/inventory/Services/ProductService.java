package com.fontebo.inventory.Services;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.fontebo.inventory.Exceptions.Exception;
import com.fontebo.inventory.Models.Product;
import com.fontebo.inventory.Records.ProductCreationRecord;
import com.fontebo.inventory.Records.ProductListRecord;
import com.fontebo.inventory.Records.ProductUpdateRecord;
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
            throw new Exception("El producto ya existe");
        } else {
            var name = productRecord.name();
            var description = productRecord.description();
            var measureUnit = productRecord.measureUnit();
            var category = categoryRepository.findById(productRecord.categoryId()).get();
            var product = new Product(name, description, measureUnit, category);
            productRepository.save(product);
            return new ProductListRecord(product);
        }
    }

    public Page<ProductListRecord> getItems(Pageable pageable) {
        return productRepository.findAll(pageable).map(ProductListRecord::new);
    }

    public ProductListRecord getProductById(Long id) {
        if (productRepository.existsById(id)) {
            Product producto = productRepository.getReferenceById(id);
            return new ProductListRecord(producto);
        } else {
            throw new Exception("El producto no existe");
        }
    }

    public boolean deleteUserById(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public ProductListRecord updateProduct(Long id, ProductUpdateRecord productRecord) {
        Optional<Product> productOptional = productRepository.findById(id);
        if (productOptional.isPresent()) {
            Product product = productOptional.get();
            if(productRecord.name()!=null){
                Optional<Product> productOptionalByName = productRepository.findByName(productRecord.name());
                if(productOptionalByName.isPresent()&&!product.getName().equals(productRecord.name())){
                    System.out.println(productOptional.get().getName());
                    System.out.println(productRecord.name());
                    throw new Exception("Este nombre corresponde a un producto ya existente");
                }
                product.setName(productRecord.name());
            }
            if(productRecord.description()!=null){
                product.setDescription(productRecord.description());
            }
            if(productRecord.measureUnit()!=null){
                product.setMeasureUnit(productRecord.measureUnit());
            }
            if(productRecord.categoryId()!=null){
                product.setCategory(categoryRepository.findById(productRecord.categoryId()).get());
            }

            Product productoActualizado = productRepository.save(product);
            return new ProductListRecord(productoActualizado);
        }else{
        // Manejar el caso en que el producto no se encuentra
        throw new Exception("No se encontro el producto con id: " + id);
    }
}
    // Otros métodos para editar y eliminar productos
}