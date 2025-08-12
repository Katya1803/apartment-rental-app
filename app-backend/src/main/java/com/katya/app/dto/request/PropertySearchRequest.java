package com.katya.app.dto.request;

import com.katya.app.util.enums.PropertyStatus;
import com.katya.app.util.enums.PropertyType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertySearchRequest {

    private String query;
    private PropertyType propertyType;
    private PropertyStatus status;

    @DecimalMin(value = "0.00", message = "Min price cannot be negative")
    private BigDecimal minPrice;

    @DecimalMin(value = "0.00", message = "Max price cannot be negative")
    private BigDecimal maxPrice;

    @DecimalMin(value = "0.00", message = "Min area cannot be negative")
    private BigDecimal minArea;

    @DecimalMin(value = "0.00", message = "Max area cannot be negative")
    private BigDecimal maxArea;

    @Min(value = 0, message = "Min bedrooms cannot be negative")
    @Max(value = 50, message = "Min bedrooms cannot exceed 50")
    private Short minBedrooms;

    @Min(value = 0, message = "Max bedrooms cannot be negative")
    @Max(value = 50, message = "Max bedrooms cannot exceed 50")
    private Short maxBedrooms;

    @Min(value = 0, message = "Min bathrooms cannot be negative")
    @Max(value = 50, message = "Min bathrooms cannot exceed 50")
    private Short minBathrooms;

    @Min(value = 0, message = "Max bathrooms cannot be negative")
    @Max(value = 50, message = "Max bathrooms cannot exceed 50")
    private Short maxBathrooms;

    private List<Short> amenityIds;
    private Boolean isFeatured;
    private String locale;

    // Sorting
    @Builder.Default
    private String sortBy = "createdAt";

    @Builder.Default
    private String sortDirection = "desc";

    // Pagination
    @Min(value = 0, message = "Page cannot be negative")
    @Builder.Default
    private Integer page = 0;

    @Min(value = 1, message = "Size must be at least 1")
    @Max(value = 100, message = "Size cannot exceed 100")
    @Builder.Default
    private Integer size = 20;
}