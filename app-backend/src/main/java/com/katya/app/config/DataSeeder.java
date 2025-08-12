package com.katya.app.config;

import com.katya.app.model.entity.AppUser;
import com.katya.app.repository.AppUserRepository;
import com.katya.app.util.enums.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.admin.full-name}")
    private String adminFullName;

    @Value("${app.admin.role}")
    private UserRole adminRole;

    @Bean
    CommandLineRunner seedAdminUser() {
        return args -> {
            if (userRepository.findByEmailAndIsActiveTrue(adminEmail).isEmpty()) {
                AppUser admin = AppUser.builder()
                        .email(adminEmail)
                        .passwordHash(passwordEncoder.encode(adminPassword))
                        .fullName(adminFullName)
                        .role(adminRole)
                        .isActive(true)
                        .build();
                admin.setCreatedAt(LocalDateTime.now());
                admin.setUpdatedAt(LocalDateTime.now());
                userRepository.save(admin);
            }
        };
    }
}