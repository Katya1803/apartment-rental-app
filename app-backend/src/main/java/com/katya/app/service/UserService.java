package com.katya.app.service;

import com.katya.app.dto.request.PasswordChangeRequest;
import com.katya.app.dto.request.UserCreateRequest;
import com.katya.app.dto.request.UserUpdateRequest;
import com.katya.app.dto.response.UserSummaryResponse;
import com.katya.app.util.enums.UserRole;
import org.springframework.data.domain.Page;

public interface UserService {

    // User CRUD operations
    Page<UserSummaryResponse> getAllUsers(int page, int size);

    Page<UserSummaryResponse> getUsersByRole(UserRole role, int page, int size);

    Page<UserSummaryResponse> searchUsers(String query, int page, int size);

    UserSummaryResponse getUserById(Long id);

    UserSummaryResponse createUser(UserCreateRequest request);

    UserSummaryResponse updateUser(Long id, UserUpdateRequest request);

    void deactivateUser(Long id);

    void activateUser(Long id);

    void changeUserPassword(Long id, PasswordChangeRequest request);

    // Utility methods
    boolean isEmailAvailable(String email, Long excludeId);

    long getTotalActiveUsers();

    long getUserCountByRole(UserRole role);
}