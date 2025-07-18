package com.example.carpooling.model;

import javax.persistence.*;

@Entity
@Table(name = "users") // Avoids using reserved keyword "user" in some DBs
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true) // ✅ enforce uniqueness
    private String username; // ✅ added username

    private String role = "USER"; // Default role

    // 👉 Constructors
    public User() {
    }

    public User(String email, String password, String username, String role) {
        this.email = email;
        this.password = password;
        this.username = username; // ✅ added
        this.role = role;
    }

    // 👉 Getters & Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() { // ✅ added
        return username;
    }

    public void setUsername(String username) { // ✅ added
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
