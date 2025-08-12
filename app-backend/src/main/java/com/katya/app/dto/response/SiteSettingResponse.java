package com.katya.app.dto.response;

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
public class SiteSettingResponse {
    private String key;
    private String value; // Default value
    private String displayValue; // Localized value
    private Map<String, String> translations;
    private LocalDateTime updatedAt;
    private UserSummaryResponse updatedBy;
}