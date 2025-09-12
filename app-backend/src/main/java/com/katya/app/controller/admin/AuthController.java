package com.katya.app.controller.admin;

import com.katya.app.dto.common.ApiResponse;
import com.katya.app.dto.request.LoginRequest;
import com.katya.app.dto.request.PasswordChangeRequest;
import com.katya.app.dto.response.LoginResponse;
import com.katya.app.security.UserPrincipal;
import com.katya.app.service.AuthService;
import com.katya.app.util.ResponseBuilder;
import com.katya.app.util.constant.ApiEndpoints;
import jakarta.validation.Valid;
import lombok.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiEndpoints.AUTH)
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseBuilder.success(response, "Login successful");
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<LoginResponse>> refreshToken(@RequestBody RefreshTokenRequest request) {
        LoginResponse response = authService.refreshToken(request.getRefreshToken());
        return ResponseBuilder.success(response, "Token refreshed successfully");
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(@RequestBody(required = false) RefreshTokenRequest request) {
        String refreshToken = request != null ? request.getRefreshToken() : null;
        authService.logout(refreshToken);
        return ResponseBuilder.success("Logout successful");
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserInfoResponse>> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        UserInfoResponse userInfo = UserInfoResponse.builder()
                .id(userPrincipal.getId())
                .email(userPrincipal.getUsername())
                .fullName(userPrincipal.getFullName())
                .role(userPrincipal.getUser().getRole())
                .isActive(userPrincipal.isEnabled())
                .build();

        return ResponseBuilder.success(userInfo);
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @Valid @RequestBody PasswordChangeRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        authService.changePassword(userPrincipal.getId(), request);
        return ResponseBuilder.success("Password changed successfully");
    }

    // Inner DTOs
    @Data
    public static class RefreshTokenRequest {
        private String refreshToken;

    }

    @Data
    @Builder
    public static class UserInfoResponse {
        private Long id;
        private String email;
        private String fullName;
        private com.katya.app.util.enums.UserRole role;
        private Boolean isActive;
    }
}