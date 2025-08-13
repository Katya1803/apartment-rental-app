package com.katya.app.dto.request;

import com.katya.app.util.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateRequest {

    @Email(message = "Invalid email format")
    private String email;

    @Size(max = 100, message = "Full name cannot exceed 100 characters")
    private String fullName;

    private UserRole role;

    private Boolean isActive;
}