package com.example.carpooling.service;

import com.example.carpooling.dto.LoginRequest;
import com.example.carpooling.dto.RegisterRequest;
import com.example.carpooling.model.User;
import com.example.carpooling.repository.UserRepository;
import com.example.carpooling.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private BCryptPasswordEncoder encoder;

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;  // ✅ Don't autowire itself!

    @Autowired
    private JwtUtil jwtUtil;

    public String register(RegisterRequest request) {
        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            return "User already exists";
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));
        userRepo.save(user);
        return "User registered successfully";
    }

    public String login(LoginRequest request) {
        try {
            // Authenticate user
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(), request.getPassword()
                    )
            );

            //  CustomUserDetailsService to load user
            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());

            //  Generate token using the username
            return jwtUtil.generateToken(userDetails.getUsername());

        } catch (AuthenticationException e) {
            return "Invalid email or password";
        }
    }
}
