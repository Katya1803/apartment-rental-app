package com.katya.app.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmenityResponse {
    private Short id;
    private String key;
    private String label; // Current locale label
    private Map<String, String> translations; // All translations
    private Boolean isRoomAmenity;
    private Boolean isCommonAmenity;
}