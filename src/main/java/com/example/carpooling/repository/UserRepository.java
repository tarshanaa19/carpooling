package com.example.carpooling.repository;

import com.example.carpooling.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // ✅ Used for authentication and JWT validation
    Optional<User> findByEmail(String email);

    // ✅ Used for login (if you use username instead of email)
    Optional<User> findByUsername(String username);

    // ✅ For registration validation
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}
