package com.fontebo.inventory.Controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import com.fontebo.inventory.Models.User;
import com.fontebo.inventory.Records.TokenRecord;
import com.fontebo.inventory.Records.UserCredentialRecord;
import com.fontebo.inventory.Services.JwtService;

import jakarta.validation.Valid;

@RestController
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;


    @PostMapping("/authenticate")
    public ResponseEntity<TokenRecord> createAuthenticationToken(@RequestBody @Valid UserCredentialRecord userCredentialRecord) throws Exception {
        Authentication  authenticateUser;
        try {
            authenticateUser=authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userCredentialRecord.userName(), userCredentialRecord.password())
            );
        } catch (Exception e) {
            throw new Exception("Incorrect username or password", e);
        }

        
        final String jwt = jwtService.generarToken((User) authenticateUser.getPrincipal());

        return ResponseEntity.ok(new TokenRecord(jwt));
    }
    @GetMapping("/validateToken")
    public String validateToken(@RequestHeader("Authorization") String token) {
        token = token.substring(7); // Remove "Bearer " prefix
        System.out.println(jwtService.getSubject(token));
        System.out.println("retorno algo");
        return jwtService.getSubject(token); // Assuming you have a way to get UserDetails
    }
}


