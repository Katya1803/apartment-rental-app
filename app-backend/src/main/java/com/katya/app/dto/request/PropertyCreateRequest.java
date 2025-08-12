package com.katya.app.dto.request;

import com.katya.app.util.enums.PropertyStatus;
import com.katya.app.util.enums.PropertyType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyCreateRequest {

    @NotBlank(message = "Slug is required")
    @Pattern(regexp = "^[a-z0-9-]+$", message = "Slug must contain only lowercase letters, numbers, and hyphens")
    private String slug;

    private String code;

    @NotNull(message = "Property type is required")
    private PropertyType propertyType;

    @NotNull(message = "Monthly price is required")
    @DecimalMin(value = "0.00", inclusive = false, message = "Price must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Price format is invalid")
    private BigDecimal priceMonth;

    @DecimalMin(value = "0.00", inclusive = false, message = "Area must be greater than 0")
    @Digits(integer = 8, fraction = 2, message = "Area format is invalid")
    private BigDecimal areaSqm;

    @Min(value = 0, message = "Bedrooms cannot be negative")
    @Max(value = 50, message = "Bedrooms cannot exceed 50")
    private Short bedrooms;

    @Min(value = 0, message = "Bathrooms cannot be negative")
    @Max(value = 50, message = "Bathrooms cannot exceed 50")
    private Short bathrooms;

    private Short floorNo;
    private String petPolicy;
    private String viewDesc;

    @DecimalMin(value = "-90.0", message = "Invalid latitude")
    @DecimalMax(value = "90.0", message = "Invalid latitude")
    private Double latitude;

    @DecimalMin(value = "-180.0", message = "Invalid longitude")
    @DecimalMax(value = "180.0", message = "Invalid longitude")
    private Double longitude;

    private String addressLine;

    @Builder.Default
    private PropertyStatus status = PropertyStatus.DRAFT;

    @Builder.Default
    private Boolean isFeatured = false;

    // Multilingual content
    @Valid
    @NotEmpty(message = "At least one translation is required")
    private Map<String, PropertyTranslationRequest> translations;

    // Amenities
    private List<Short> amenityIds;
}
