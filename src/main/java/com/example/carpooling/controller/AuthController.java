package com.example.carpooling.controller;
import com.example.carpooling.service.CustomUserDetailsService;
import com.example.carpooling.dto.LoginRequest;
import com.example.carpooling.dto.RegisterRequest;
import com.example.carpooling.dto.AuthResponse;
import com.example.carpooling.service.UserService;
import com.example.carpooling.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    @Autowired
    private CustomUserDetailsService userDetailsService;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        return userService.register(request);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Authenticate
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            //  Load
            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail()); //


            // Generate Token from username
            String jwtToken = jwtUtil.generateToken(userDetails.getUsername());

            //  Return token
            return ResponseEntity.ok(new AuthResponse(jwtToken));

        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }
}
