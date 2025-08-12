package com.katya.app.dto.response;

import com.katya.app.util.enums.PropertyStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentPageResponse {
    private Long id;
    private String slug;
    private PropertyStatus status;
    private String title; // Current locale title
    private String bodyPreview; // First 200 chars
    private Map<String, ContentPageTranslationResponse> translations;
    private UserSummaryResponse createdBy;
    private UserSummaryResponse updatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}