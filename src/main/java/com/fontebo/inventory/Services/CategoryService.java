package com.fontebo.inventory.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fontebo.inventory.Exceptions.CategoriaDuplicadaException;
import com.fontebo.inventory.Models.Category;
import com.fontebo.inventory.Repositories.CategoryRepository;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public Category createCategory(Category category) {
        Optional<Category> categoriaExistente = categoryRepository.findByName(category.getName());
        if (categoriaExistente.isPresent()) {
             throw new CategoriaDuplicadaException("No se permiten duplicados");
        } else {
            Category nuevaCategoria = new Category();
            nuevaCategoria.setName(category.getName());
            categoryRepository.save(nuevaCategoria);
            return nuevaCategoria;
        }
        
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Otros métodos para editar y eliminar productos
}

