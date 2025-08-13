package com.katya.app.service.impl;

import com.katya.app.dto.mapper.UserMapper;
import com.katya.app.dto.request.PasswordChangeRequest;
import com.katya.app.dto.request.UserCreateRequest;
import com.katya.app.dto.request.UserUpdateRequest;
import com.katya.app.dto.response.UserSummaryResponse;
import com.katya.app.exception.DuplicateResourceException;
import com.katya.app.exception.InvalidOperationException;
import com.katya.app.exception.ResourceNotFoundException;
import com.katya.app.exception.ValidationException;
import com.katya.app.model.entity.AppUser;
import com.katya.app.repository.AppUserRepository;
import com.katya.app.service.UserService;
import com.katya.app.util.DtoUtils;
import com.katya.app.util.enums.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final AppUserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public Page<UserSummaryResponse> getAllUsers(int page, int size) {
        Pageable pageable = DtoUtils.createPageable(page, size, "createdAt", "desc");
        Page<AppUser> users = userRepository.findAllActiveUsers(pageable);
        return users.map(userMapper::toSummaryResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserSummaryResponse> getUsersByRole(UserRole role, int page, int size) {
        Pageable pageable = DtoUtils.createPageable(page, size, "createdAt", "desc");
        Page<AppUser> users = userRepository.findByRoleAndIsActiveTrue(role, pageable);
        return users.map(userMapper::toSummaryResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserSummaryResponse> searchUsers(String query, int page, int size) {
        Pageable pageable = DtoUtils.createPageable(page, size, "createdAt", "desc");
        Page<AppUser> users = userRepository.searchUsers(query, pageable);
        return users.map(userMapper::toSummaryResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public UserSummaryResponse getUserById(Long id) {
        AppUser user = userRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return userMapper.toSummaryResponse(user);
    }

    @Override
    @Transactional
    public UserSummaryResponse createUser(UserCreateRequest request) {
        log.info("Creating new user: {}", request.getEmail());

        // Check email uniqueness
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User", "email", request.getEmail());
        }

        // Validate password
        validatePassword(request.getPassword());

        // Create user entity
        AppUser user = userMapper.toEntity(request);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        user = userRepository.save(user);

        log.info("User created successfully with ID: {}", user.getId());
        return userMapper.toSummaryResponse(user);
    }

    @Override
    @Transactional
    public UserSummaryResponse updateUser(Long id, UserUpdateRequest request) {
        log.info("Updating user ID: {}", id);

        AppUser user = userRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        // Check email uniqueness if changed
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmailAndIdNot(request.getEmail(), id)) {
                throw new DuplicateResourceException("User", "email", request.getEmail());
            }
        }

        // Update fields
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        if (request.getIsActive() != null) {
            user.setIsActive(request.getIsActive());
        }

        user = userRepository.save(user);

        log.info("User updated successfully: {}", id);
        return userMapper.toSummaryResponse(user);
    }

    @Override
    @Transactional
    public void deactivateUser(Long id) {
        log.info("Deactivating user ID: {}", id);

        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        if (!user.getIsActive()) {
            throw new InvalidOperationException("User is already deactivated");
        }

        user.setIsActive(false);
        userRepository.save(user);

        log.info("User deactivated successfully: {}", id);
    }

    @Override
    @Transactional
    public void activateUser(Long id) {
        log.info("Activating user ID: {}", id);

        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        if (user.getIsActive()) {
            throw new InvalidOperationException("User is already active");
        }

        user.setIsActive(true);
        userRepository.save(user);

        log.info("User activated successfully: {}", id);
    }

    @Override
    @Transactional
    public void changeUserPassword(Long id, PasswordChangeRequest request) {
        log.info("Changing password for user ID: {}", id);

        AppUser user = userRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        // Validate new password
        validatePassword(request.getNewPassword());

        // Check password confirmation
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ValidationException("New password and confirmation password do not match");
        }

        // Update password
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        log.info("Password changed successfully for user: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isEmailAvailable(String email, Long excludeId) {
        return excludeId != null
                ? !userRepository.existsByEmailAndIdNot(email, excludeId)
                : !userRepository.existsByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public long getTotalActiveUsers() {
        return userRepository.countActiveUsers();
    }

    @Override
    @Transactional(readOnly = true)
    public long getUserCountByRole(UserRole role) {
        return userRepository.countByRoleAndIsActiveTrue(role);
    }

    // Helper methods
    private void validatePassword(String password) {
        if (password == null || password.trim().isEmpty()) {
            throw new ValidationException("Password is required");
        }
        if (password.length() < 6) {
            throw new ValidationException("Password must be at least 6 characters long");
        }
        if (password.length() > 50) {
            throw new ValidationException("Password cannot exceed 50 characters");
        }
    }
}