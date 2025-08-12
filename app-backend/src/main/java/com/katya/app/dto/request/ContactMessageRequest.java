package com.katya.app.dto.request;

import com.katya.app.util.enums.Locale;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactMessageRequest {

    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Full name cannot exceed 100 characters")
    private String fullName;

    @Email(message = "Invalid email format")
    private String email;

    @Size(max = 20, message = "Phone number cannot exceed 20 characters")
    private String phone;

    @Size(max = 200, message = "Subject cannot exceed 200 characters")
    private String subject;

    @NotBlank(message = "Message is required")
    @Size(max = 2000, message = "Message cannot exceed 2000 characters")
    private String message;

    private Long propertyId;

    @Builder.Default
    private Locale preferredLang = Locale.VI;
}
