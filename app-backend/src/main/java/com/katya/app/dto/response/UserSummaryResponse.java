package com.katya.app.dto.response;

import com.katya.app.util.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSummaryResponse {
    private Long id;
    private String email;
    private String fullName;
    private UserRole role;
    private Boolean isActive;
}