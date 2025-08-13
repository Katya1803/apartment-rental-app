package com.katya.app.controller.page;

import com.katya.app.dto.common.ApiResponse;
import com.katya.app.dto.response.AmenityResponse;
import com.katya.app.service.AmenityService;
import com.katya.app.util.DtoUtils;
import com.katya.app.util.ResponseBuilder;
import com.katya.app.util.constant.ApiEndpoints;
import com.katya.app.util.constant.AppConstants;
import com.katya.app.util.enums.Locale;
import com.katya.app.util.enums.PropertyType;
import com.katya.app.util.validation.ValidLocale;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiEndpoints.AMENITIES)
@RequiredArgsConstructor
public class AmenityController {

    private final AmenityService amenityService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AmenityResponse>>> getAllAmenities(
            @RequestParam(required = false, defaultValue = AppConstants.DEFAULT_LOCALE) @ValidLocale String locale) {

        Locale loc = DtoUtils.parseLocale(locale, Locale.VI);
        List<AmenityResponse> amenities = amenityService.getAllAmenities(loc);
        return ResponseBuilder.success(amenities);
    }

    @GetMapping("/property-type/{propertyType}")
    public ResponseEntity<ApiResponse<List<AmenityResponse>>> getAmenitiesForPropertyType(
            @PathVariable PropertyType propertyType,
            @RequestParam(required = false, defaultValue = AppConstants.DEFAULT_LOCALE) @ValidLocale String locale) {

        Locale loc = DtoUtils.parseLocale(locale, Locale.VI);
        List<AmenityResponse> amenities = amenityService.getAmenitiesForPropertyType(propertyType, loc);
        return ResponseBuilder.success(amenities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AmenityResponse>> getAmenityById(
            @PathVariable Short id,
            @RequestParam(required = false, defaultValue = AppConstants.DEFAULT_LOCALE) @ValidLocale String locale) {

        Locale loc = DtoUtils.parseLocale(locale, Locale.VI);
        AmenityResponse amenity = amenityService.getAmenityById(id, loc);
        return ResponseBuilder.success(amenity);
    }
}