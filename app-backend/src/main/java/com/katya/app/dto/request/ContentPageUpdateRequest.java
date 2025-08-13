package com.katya.app.dto.request;

import com.katya.app.util.enums.PropertyStatus;
import jakarta.validation.Valid;
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
public class ContentPageUpdateRequest {

    @Pattern(regexp = "^[a-z0-9-]+$", message = "Slug must contain only lowercase letters, numbers, and hyphens")
    private String slug;

    private PropertyStatus status;

    @Valid
    private Map<String, ContentPageTranslationRequest> translations;
}