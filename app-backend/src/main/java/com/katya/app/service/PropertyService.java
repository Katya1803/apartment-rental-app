package com.katya.app.service;

import com.katya.app.dto.request.PropertyCreateRequest;
import com.katya.app.dto.request.PropertySearchRequest;
import com.katya.app.dto.request.PropertyUpdateRequest;
import com.katya.app.dto.response.PropertyDetailResponse;
import com.katya.app.dto.response.PropertySummaryResponse;
import com.katya.app.util.enums.Locale;
import com.katya.app.util.enums.PropertyType;
import org.springframework.data.domain.Page;

import java.util.List;

public interface PropertyService {

    // Public APIs
    Page<PropertySummaryResponse> getPublishedProperties(PropertyType type, Locale locale, int page, int size);

    PropertyDetailResponse getPropertyBySlug(String slug, Locale locale);

    Page<PropertySummaryResponse> searchProperties(PropertySearchRequest request, Locale locale);

    List<PropertySummaryResponse> getFeaturedProperties(Locale locale);

    // Admin APIs
    Page<PropertySummaryResponse> getPropertiesForAdmin(PropertySearchRequest request, int page, int size);

    PropertyDetailResponse getPropertyForAdmin(Long id);

    PropertyDetailResponse createProperty(PropertyCreateRequest request, Long userId);

    PropertyDetailResponse updateProperty(Long id, PropertyUpdateRequest request, Long userId);

    void deleteProperty(Long id);

    // Utility
    boolean isSlugAvailable(String slug, Long excludeId);
}