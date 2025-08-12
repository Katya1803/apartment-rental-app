package com.katya.app.dto.response;

import com.katya.app.util.enums.Locale;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactMessageResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String subject;
    private String message;
    private PropertySummaryResponse property;
    private Locale preferredLang;
    private LocalDateTime createdAt;
    private Boolean isHandled;
    private UserSummaryResponse handledBy;
    private LocalDateTime handledAt;
    private String responseTimeFormatted;
}
