package com.katya.app.dto.response;

import com.katya.app.util.enums.PropertyStatus;
import com.katya.app.util.enums.PropertyType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertySummaryResponse {
    private Long id;
    private String slug;
    private String code;
    private PropertyType propertyType;
    private String title;
    private String shortDescription;
    private BigDecimal priceMonth;
    private BigDecimal areaSqm;
    private Short bedrooms;
    private Short bathrooms;
    private String addressText;
    private String coverImageUrl;
    private PropertyStatus status;
    private Boolean isFeatured;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
