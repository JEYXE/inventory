package com.fontebo.inventory.Controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.fontebo.inventory.Exceptions.Exception;


import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class ExceptionController {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage()));
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Map<String,String>> handleCategoriaDuplicadaException(Exception ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("name", ex.getMessage());
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<String> handleMissingRequestBody(HttpMessageNotReadableException ex) {
        return new ResponseEntity<>("Required request body is missing", HttpStatus.BAD_REQUEST);
    }


}


