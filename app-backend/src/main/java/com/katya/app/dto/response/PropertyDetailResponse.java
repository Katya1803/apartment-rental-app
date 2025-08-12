package com.katya.app.dto.response;

import com.katya.app.util.enums.PropertyStatus;
import com.katya.app.util.enums.PropertyType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyDetailResponse {
    private Long id;
    private String slug;
    private String code;
    private PropertyType propertyType;
    private BigDecimal priceMonth;
    private BigDecimal areaSqm;
    private Short bedrooms;
    private Short bathrooms;
    private Short floorNo;
    private String petPolicy;
    private String viewDesc;
    private Double latitude;
    private Double longitude;
    private String addressLine;
    private PropertyStatus status;
    private Boolean isFeatured;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Multilingual content
    private Map<String, PropertyTranslationResponse> translations;

    // Related entities
    private List<PropertyImageResponse> images;
    private List<AmenityResponse> amenities;
    private UserSummaryResponse createdBy;
    private UserSummaryResponse updatedBy;

    // Statistics
    private Integer totalImages;
    private Integer totalAmenities;
    private Integer totalInquiries;
}