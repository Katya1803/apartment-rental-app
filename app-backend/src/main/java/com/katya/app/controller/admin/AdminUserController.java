package com.katya.app.controller.admin;

import com.katya.app.dto.common.ApiResponse;
import com.katya.app.dto.common.PageResponse;
import com.katya.app.dto.request.PasswordChangeRequest;
import com.katya.app.dto.request.UserCreateRequest;
import com.katya.app.dto.response.UserSummaryResponse;
import com.katya.app.util.ResponseBuilder;
import com.katya.app.util.constant.ApiEndpoints;
import com.katya.app.util.constant.AppConstants;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiEndpoints.ADMIN_USERS)
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class AdminUserController {

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deactivateUser(@PathVariable Long id) {
        // TODO: Implement UserService.deactivateUser(id)
        return ResponseBuilder.success("User deactivation not implemented yet");
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<String>> activateUser(@PathVariable Long id) {
        // TODO: Implement UserService.activateUser(id)
        return ResponseBuilder.success("User activation not implemented yet");
    }

    @PostMapping("/{id}/change-password")
    public ResponseEntity<ApiResponse<String>> changeUserPassword(
            @PathVariable Long id,
            @Valid @RequestBody PasswordChangeRequest request) {

        // TODO: Implement UserService.changePassword(id, request)
        return ResponseBuilder.success("Password change not implemented yet");
    }
}