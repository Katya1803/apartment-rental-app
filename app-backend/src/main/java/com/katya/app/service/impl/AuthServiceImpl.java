package com.katya.app.service.impl;

import com.katya.app.dto.request.LoginRequest;
import com.katya.app.dto.request.PasswordChangeRequest;
import com.katya.app.dto.response.LoginResponse;
import com.katya.app.dto.response.UserSummaryResponse;
import com.katya.app.exception.ResourceNotFoundException;
import com.katya.app.exception.UnauthorizedException;
import com.katya.app.exception.ValidationException;
import com.katya.app.model.entity.AppUser;
import com.katya.app.model.entity.RefreshToken;
import com.katya.app.repository.AppUserRepository;
import com.katya.app.repository.RefreshTokenRepository;
import com.katya.app.security.JwtService;
import com.katya.app.security.UserPrincipal;
import com.katya.app.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AppUserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        AppUser user = userPrincipal.getUser();

        String accessToken = jwtService.generateAccessToken(
                user.getEmail(), user.getId(), user.getRole().name()
        );
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        saveRefreshToken(user, refreshToken);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtService.getAccessTokenExpirationSeconds())
                .user(buildUserSummaryResponse(user))
                .build();
    }

    @Override
    @Transactional
    public LoginResponse refreshToken(String refreshTokenValue) {
        if (!jwtService.isTokenValid(refreshTokenValue) || !jwtService.isRefreshToken(refreshTokenValue)) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        RefreshToken refreshToken = refreshTokenRepository
                .findByTokenAndIsRevokedFalse(refreshTokenValue)
                .orElseThrow(() -> new UnauthorizedException("Refresh token not found"));

        if (refreshToken.isExpired()) {
            throw new UnauthorizedException("Refresh token expired");
        }

        String email = jwtService.extractEmail(refreshTokenValue);
        AppUser user = userRepository.findByEmailAndIsActiveTrue(email)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        String newAccessToken = jwtService.generateAccessToken(
                user.getEmail(), user.getId(), user.getRole().name()
        );

        return LoginResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshTokenValue)
                .tokenType("Bearer")
                .expiresIn(jwtService.getAccessTokenExpirationSeconds())
                .user(buildUserSummaryResponse(user))
                .build();
    }

    @Override
    @Transactional
    public void logout(String refreshTokenValue) {
        if (refreshTokenValue != null) {
            refreshTokenRepository.findByTokenAndIsRevokedFalse(refreshTokenValue)
                    .ifPresent(token -> {
                        token.setIsRevoked(true);
                        refreshTokenRepository.save(token);
                    });
        }
    }

    @Override
    @Transactional
    public void changePassword(Long userId, PasswordChangeRequest request) {
        log.info("Changing password for user ID: {}", userId);

        // Find the user
        AppUser user = userRepository.findByIdAndIsActiveTrue(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Check current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new ValidationException("Current password is incorrect");
        }

        // Validate new password
        if (request.getNewPassword().length() < 6) {
            throw new ValidationException("New password must be at least 6 characters long");
        }

        // Check password confirmation
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ValidationException("New password and confirmation password do not match");
        }

        // Update password
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        log.info("Password changed successfully for user: {}", user.getEmail());
    }

    private void saveRefreshToken(AppUser user, String token) {
        RefreshToken refreshToken = RefreshToken.builder()
                .token(token)
                .user(user)
                .expiresAt(LocalDateTime.now().plusSeconds(
                        jwtService.jwtProperties.getRefreshTokenExpiration() / 1000))
                .build();

        refreshTokenRepository.save(refreshToken);
    }

    private UserSummaryResponse buildUserSummaryResponse(AppUser user) {
        return UserSummaryResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .build();
    }
}
