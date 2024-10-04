package com.fontebo.inventory.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import com.fontebo.inventory.Models.User;

public interface UserRepository extends JpaRepository<User, Long>{

    UserDetails findByEmail(String userName);

}
