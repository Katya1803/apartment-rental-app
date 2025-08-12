package com.katya.app.dto.mapper;

import com.katya.app.dto.request.UserCreateRequest;
import com.katya.app.dto.response.UserSummaryResponse;
import com.katya.app.model.entity.AppUser;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public AppUser toEntity(UserCreateRequest request) {
        return AppUser.builder()
                .email(request.getEmail())
                .fullName(request.getFullName())
                .role(request.getRole())
                .isActive(request.getIsActive())
                .build();
    }

    public UserSummaryResponse toSummaryResponse(AppUser user) {
        if (user == null) return null;

        return UserSummaryResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .build();
    }
}