package com.fontebo.inventory.Exceptions;

public class ProductoNoExisteException extends RuntimeException {
    public ProductoNoExisteException(String message) {
        super(message);
    }
}
