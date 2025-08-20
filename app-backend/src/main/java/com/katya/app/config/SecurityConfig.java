package com.katya.app.config;

import com.katya.app.security.CustomUserDetailsService;
import com.katya.app.security.JwtAuthenticationFilter;
import com.katya.app.util.constant.ApiEndpoints;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // ===== Password Encoder =====
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    // ===== Authentication Provider =====
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    // ===== Authentication Manager =====
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // ===== Security Filter Chain =====
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {}) // dùng CorsConfig riêng
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // ==== Swagger / OpenAPI ====
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()

                        // ==== Auth endpoints ====
                        .requestMatchers(ApiEndpoints.AUTH + "/**").permitAll()

                        // ==== Public endpoints ====
                        .requestMatchers(HttpMethod.GET, ApiEndpoints.PROPERTIES + "/**").permitAll()
                        .requestMatchers(HttpMethod.GET, ApiEndpoints.AMENITIES + "/**").permitAll()
                        .requestMatchers(HttpMethod.GET, ApiEndpoints.DISTRICTS + "/**").permitAll()
                        .requestMatchers(HttpMethod.GET, ApiEndpoints.CONTENT + "/**").permitAll()
                        .requestMatchers(HttpMethod.GET, ApiEndpoints.COMPANY_INFO + "/**").permitAll()
                        .requestMatchers(HttpMethod.POST, ApiEndpoints.CONTACT).permitAll()
                        .requestMatchers("/uploads/**").permitAll()

                        // ==== CORS preflight ====
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // ==== Admin endpoints ====
                        .requestMatchers(ApiEndpoints.ADMIN_BASE + "/**")
                        .hasAnyRole("ADMIN", "SUPER_ADMIN", "EDITOR")

                        // ==== Others ====
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
