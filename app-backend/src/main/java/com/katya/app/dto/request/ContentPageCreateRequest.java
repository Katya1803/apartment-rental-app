package com.katya.app.dto.request;

import com.katya.app.util.enums.PropertyStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentPageCreateRequest {

    @NotBlank(message = "Slug is required")
    @Pattern(regexp = "^[a-z0-9-]+$", message = "Slug must contain only lowercase letters, numbers, and hyphens")
    private String slug;

    @Builder.Default
    private PropertyStatus status = PropertyStatus.DRAFT;

    @Valid
    @NotEmpty(message = "At least one translation is required")
    private Map<String, ContentPageTranslationRequest> translations;
}