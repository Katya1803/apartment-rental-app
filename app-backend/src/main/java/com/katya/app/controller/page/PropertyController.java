package com.katya.app.controller.page;

import com.katya.app.dto.common.ApiResponse;
import com.katya.app.dto.common.PageResponse;
import com.katya.app.dto.request.PropertySearchRequest;
import com.katya.app.dto.response.PropertyDetailResponse;
import com.katya.app.dto.response.PropertySummaryResponse;
import com.katya.app.service.PropertyService;
import com.katya.app.util.DtoUtils;
import com.katya.app.util.ResponseBuilder;
import com.katya.app.util.constant.ApiEndpoints;
import com.katya.app.util.constant.AppConstants;
import com.katya.app.util.enums.Locale;
import com.katya.app.util.enums.PropertyType;
import com.katya.app.util.validation.ValidLocale;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiEndpoints.PROPERTIES)
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<PropertySummaryResponse>>> getProperties(
            @RequestParam(required = false) String propertyType,
            @RequestParam(required = false, defaultValue = AppConstants.DEFAULT_LOCALE) String locale,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size) {

        PropertyType type = DtoUtils.parsePropertyType(propertyType);
        Locale loc = DtoUtils.parseLocale(locale, Locale.EN);
        Page<PropertySummaryResponse> properties = propertyService.getPublishedProperties(type, loc, page, size);
        return ResponseBuilder.page(properties);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<PropertyDetailResponse>> getPropertyBySlug(
            @PathVariable String slug,
            @RequestParam(required = false, defaultValue = AppConstants.DEFAULT_LOCALE) String locale) {

        Locale loc = DtoUtils.parseLocale(locale, Locale.VI);
        PropertyDetailResponse property = propertyService.getPropertyBySlug(slug, loc);
        return ResponseBuilder.success(property);
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<PropertySummaryResponse>>> searchProperties(
            @Valid @ModelAttribute PropertySearchRequest request,
            @RequestParam(required = false, defaultValue = AppConstants.DEFAULT_LOCALE) String locale) {

        request.setLocale(locale);
        Locale loc = DtoUtils.parseLocale(locale, Locale.VI);
        Page<PropertySummaryResponse> properties = propertyService.searchProperties(request, loc);
        return ResponseBuilder.page(properties);
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<PropertySummaryResponse>>> getFeaturedProperties(
            @RequestParam(required = false, defaultValue = AppConstants.DEFAULT_LOCALE) String locale) {

        Locale loc = DtoUtils.parseLocale(locale, Locale.VI);
        List<PropertySummaryResponse> properties = propertyService.getFeaturedProperties(loc);
        return ResponseBuilder.success(properties);
    }

    @GetMapping("/{slug}/available")
    public ResponseEntity<ApiResponse<Boolean>> checkSlugAvailability(@PathVariable String slug) {
        boolean available = propertyService.isSlugAvailable(slug, null);
        return ResponseBuilder.success(available);
    }
}