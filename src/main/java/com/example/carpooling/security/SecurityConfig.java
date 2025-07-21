package com.example.carpooling.security;

import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                new AntPathRequestMatcher("/api/auth/**"),
                                new AntPathRequestMatcher("/index.html"),
                                new AntPathRequestMatcher("/register.html"),
                                new AntPathRequestMatcher("/login.html"),
                                new AntPathRequestMatcher("/dashboard.html"),
                                new AntPathRequestMatcher("/find-ride.html"),
                                new AntPathRequestMatcher("/offer-ride.html"),
                                new AntPathRequestMatcher("/profile.html"),
                                new AntPathRequestMatcher("/my-ride.html"),
                                new AntPathRequestMatcher("/**/*.js"),
                                new AntPathRequestMatcher("/**/*.css"),
                                new AntPathRequestMatcher("/**/*.png"),
                                new AntPathRequestMatcher("/**/*.jpg"),
                                new AntPathRequestMatcher("/**/*.jpeg")
                        ).permitAll()
                        .anyRequest().authenticated()
                );

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
