package com.fontebo.inventory.Services;

import java.util.Optional;
import org.springframework.data.domain.Sort;
import java.util.stream.Collectors;
import java.util.List;

import java.util.Map;
import java.util.HashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.fontebo.inventory.Exceptions.Exception;
import com.fontebo.inventory.Models.Product;
import com.fontebo.inventory.Records.ProductCreationRecord;
import com.fontebo.inventory.Records.ProductListRecord;
import com.fontebo.inventory.Records.ProductUpdateRecord;
import com.fontebo.inventory.Repositories.CategoryRepository;
import com.fontebo.inventory.Repositories.ProductRepository;
import java.util.ArrayList;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @PersistenceContext
    private EntityManager entityManager;

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

    public List<Product> filtrarProductos(Map<String, String> filtros) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Product> query = cb.createQuery(Product.class);
        Root<Product> root = query.from(Product.class);

        List<Predicate> predicates = new ArrayList<>();
        for (Map.Entry<String, String> filtro : filtros.entrySet()) {
            predicates.add(cb.like(root.get(filtro.getKey()), "%" + filtro.getValue() + "%"));
        }
        System.out.println(predicates);
        query.select(root).where(cb.and(predicates.toArray(new Predicate[0])));
        return entityManager.createQuery(query).getResultList();
    }

    public Page<ProductListRecord> getItems(Pageable pageable,  String name) {
        if(name==""){
            return productRepository.findAll(pageable).map(ProductListRecord::new);

        }else{
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Product> query = cb.createQuery(Product.class);
        Root<Product> root = query.from(Product.class);
        Map<String, String> filter = new HashMap<>();
        filter.put("name", name);
        List<Predicate> predicates = new ArrayList<>();
        for (Map.Entry<String, String> filters : filter.entrySet()) {
            predicates.add(cb.like(root.get(filters.getKey()), "%" + filters.getValue() + "%"));
        }
        query.select(root).where(cb.and(predicates.toArray(new Predicate[0])));
        List<ProductListRecord> productListRecords = entityManager.createQuery(query)
                .getResultList()
                .stream()
                .map(ProductListRecord::new)
                .collect(Collectors.toList());

        int total = productListRecords.size();
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), total);

        Page<ProductListRecord> page = new PageImpl<>(productListRecords.subList(start, end), pageable, total);
        return page;}
    }

    public List<ProductListRecord> getAllItems(Sort sort) {
        return productRepository.findAll(sort).stream()
                .map(ProductListRecord::new)
                .collect(Collectors.toList());
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
            if (productRecord.name() != null) {
                Optional<Product> productOptionalByName = productRepository.findByName(productRecord.name());
                if (productOptionalByName.isPresent() && !product.getName().equals(productRecord.name())) {
                    System.out.println(productOptional.get().getName());
                    System.out.println(productRecord.name());
                    throw new Exception("Este nombre corresponde a un producto ya existente");
                }
                product.setName(productRecord.name());
            }
            if (productRecord.description() != null) {
                product.setDescription(productRecord.description());
            }
            if (productRecord.measureUnit() != null) {
                product.setMeasureUnit(productRecord.measureUnit());
            }
            if (productRecord.categoryId() != null) {
                product.setCategory(categoryRepository.findById(productRecord.categoryId()).get());
            }

            Product productoActualizado = productRepository.save(product);
            return new ProductListRecord(productoActualizado);
        } else {
            // Manejar el caso en que el producto no se encuentra
            throw new Exception("No se encontro el producto con id: " + id);
        }
    }
    // Otros métodos para editar y eliminar productos
}