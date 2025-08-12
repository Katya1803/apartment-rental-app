package com.katya.app.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentPageTranslationRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String bodyMd;
}