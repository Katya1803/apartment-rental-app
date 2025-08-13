package com.katya.app.controller.admin;

import com.katya.app.dto.common.ApiResponse;
import com.katya.app.dto.common.PageResponse;
import com.katya.app.dto.request.PasswordChangeRequest;
import com.katya.app.dto.request.UserCreateRequest;
import com.katya.app.dto.request.UserUpdateRequest;
import com.katya.app.dto.response.UserSummaryResponse;
import com.katya.app.service.UserService;
import com.katya.app.util.ResponseBuilder;
import com.katya.app.util.constant.ApiEndpoints;
import com.katya.app.util.constant.AppConstants;
import com.katya.app.util.enums.UserRole;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiEndpoints.ADMIN_USERS)
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<UserSummaryResponse>>> getAllUsers(
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size) {

        Page<UserSummaryResponse> users = userService.getAllUsers(page, size);
        return ResponseBuilder.page(users);
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<ApiResponse<PageResponse<UserSummaryResponse>>> getUsersByRole(
            @PathVariable UserRole role,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size) {

        Page<UserSummaryResponse> users = userService.getUsersByRole(role, page, size);
        return ResponseBuilder.page(users);
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<UserSummaryResponse>>> searchUsers(
            @RequestParam String query,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size) {

        Page<UserSummaryResponse> users = userService.searchUsers(query, page, size);
        return ResponseBuilder.page(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserSummaryResponse>> getUserById(@PathVariable Long id) {
        UserSummaryResponse user = userService.getUserById(id);
        return ResponseBuilder.success(user);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserSummaryResponse>> createUser(
            @Valid @RequestBody UserCreateRequest request) {

        UserSummaryResponse user = userService.createUser(request);
        return ResponseBuilder.created(user, AppConstants.SUCCESS_CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserSummaryResponse>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateRequest request) {

        UserSummaryResponse user = userService.updateUser(id, request);
        return ResponseBuilder.success(user, AppConstants.SUCCESS_UPDATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deactivateUser(@PathVariable Long id) {
        userService.deactivateUser(id);
        return ResponseBuilder.success("User deactivated successfully");
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<String>> activateUser(@PathVariable Long id) {
        userService.activateUser(id);
        return ResponseBuilder.success("User activated successfully");
    }

    @PostMapping("/{id}/change-password")
    public ResponseEntity<ApiResponse<String>> changeUserPassword(
            @PathVariable Long id,
            @Valid @RequestBody PasswordChangeRequest request) {

        userService.changeUserPassword(id, request);
        return ResponseBuilder.success("Password changed successfully");
    }

    @GetMapping("/email/{email}/available")
    public ResponseEntity<ApiResponse<Boolean>> checkEmailAvailability(
            @PathVariable String email,
            @RequestParam(required = false) Long excludeId) {

        boolean available = userService.isEmailAvailable(email, excludeId);
        return ResponseBuilder.success(available);
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<UserStatsResponse>> getUserStats() {
        UserStatsResponse stats = UserStatsResponse.builder()
                .totalActiveUsers(userService.getTotalActiveUsers())
                .totalAdmins(userService.getUserCountByRole(UserRole.ADMIN))
                .totalSuperAdmins(userService.getUserCountByRole(UserRole.SUPER_ADMIN))
                .totalEditors(userService.getUserCountByRole(UserRole.EDITOR))
                .build();

        return ResponseBuilder.success(stats);
    }

    // Inner DTO for user statistics
    @lombok.Data
    @lombok.Builder
    public static class UserStatsResponse {
        private Long totalActiveUsers;
        private Long totalAdmins;
        private Long totalSuperAdmins;
        private Long totalEditors;
    }
}