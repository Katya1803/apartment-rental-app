package com.katya.app.service.impl;

import com.katya.app.dto.mapper.PropertyMapper;
import com.katya.app.dto.request.PropertyCreateRequest;
import com.katya.app.dto.request.PropertySearchRequest;
import com.katya.app.dto.request.PropertyTranslationRequest;
import com.katya.app.dto.request.PropertyUpdateRequest;
import com.katya.app.dto.response.PropertyDetailResponse;
import com.katya.app.dto.response.PropertySummaryResponse;
import com.katya.app.exception.DuplicateResourceException;
import com.katya.app.exception.ResourceNotFoundException;
import com.katya.app.exception.ValidationException;
import com.katya.app.model.embeddable.PropertyAmenityId;
import com.katya.app.model.entity.*;
import com.katya.app.model.embeddable.PropertyI18nId;
import com.katya.app.repository.*;
import com.katya.app.service.PropertyService;
import com.katya.app.util.DtoUtils;
import com.katya.app.util.constant.BusinessConstants;
import com.katya.app.util.enums.Locale;
import com.katya.app.util.enums.PropertyStatus;
import com.katya.app.util.enums.PropertyType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepository propertyRepository;
    private final PropertyI18nRepository propertyI18nRepository;
    private final PropertyAmenityRepository propertyAmenityRepository;
    private final AmenityRepository amenityRepository;
    private final AppUserRepository userRepository;
    private final PropertyMapper propertyMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<PropertySummaryResponse> getPublishedProperties(PropertyType type, Locale locale, int page, int size) {
        locale = DtoUtils.parseLocale(locale.getCode(), Locale.VI);
        Pageable pageable = DtoUtils.createPageable(page, size, "publishedAt", "desc");

        Page<Property> properties = type != null
                ? propertyRepository.findPublishedPropertiesByType(type, pageable)
                : propertyRepository.findPublishedProperties(pageable);

        Locale finalLocale = locale;
        return properties.map(property -> propertyMapper.toSummaryResponse(property, finalLocale));
    }

    @Override
    @Transactional(readOnly = true)
    public PropertyDetailResponse getPropertyBySlug(String slug, Locale locale) {
        locale = DtoUtils.parseLocale(locale.getCode(), Locale.VI);

        Property property = propertyRepository.findBySlugAndStatus(slug, PropertyStatus.PUBLISHED)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "slug", slug));

        return propertyMapper.toDetailResponse(property, locale);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PropertySummaryResponse> searchProperties(PropertySearchRequest request, Locale locale) {
        locale = DtoUtils.parseLocale(request.getLocale(), Locale.VI);
        Pageable pageable = DtoUtils.createPageable(
                request.getPage(),
                request.getSize(),
                request.getSortBy(),
                request.getSortDirection()
        );

        Page<Property> properties;

        // Simple search if only query provided
        if (hasOnlyQuery(request)) {
            properties = propertyRepository.searchPublishedProperties(request.getQuery(), pageable);
        }
        // Price range search
        else if (hasOnlyPriceFilter(request)) {
            properties = propertyRepository.findPropertiesByPriceRange(
                    request.getMinPrice(), request.getMaxPrice(), pageable);
        }
        // Complex search with multiple filters
        else {
            properties = propertyRepository.searchPropertiesWithFilters(
                    request.getQuery(),
                    request.getPropertyType(),
                    request.getMinPrice(),
                    request.getMaxPrice(),
                    request.getMinArea(),
                    request.getMaxArea(),
                    request.getMinBedrooms(),
                    request.getMaxBedrooms(),
                    request.getIsFeatured(),
                    pageable
            );
        }

        Locale finalLocale = locale;
        return properties.map(property -> propertyMapper.toSummaryResponse(property, finalLocale));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PropertySummaryResponse> getFeaturedProperties(Locale locale) {
        locale = DtoUtils.parseLocale(locale.getCode(), Locale.VI);

        List<Property> properties = propertyRepository.findFeaturedProperties();
        Locale finalLocale = locale;
        return properties.stream()
                .map(property -> propertyMapper.toSummaryResponse(property, finalLocale))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PropertySummaryResponse> getPropertiesForAdmin(PropertySearchRequest request, int page, int size) {
        Pageable pageable = DtoUtils.createPageable(page, size, "createdAt", "desc");

        Page<Property> properties = propertyRepository.findPropertiesForAdmin(
                DtoUtils.parsePropertyStatus(request.getStatus() != null ? request.getStatus().name() : null),
                request.getPropertyType(),
                pageable
        );

        return properties.map(property -> propertyMapper.toSummaryResponse(property, Locale.VI));
    }

    @Override
    @Transactional(readOnly = true)
    public PropertyDetailResponse getPropertyForAdmin(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));

        return propertyMapper.toDetailResponse(property, Locale.VI);
    }

    @Override
    @Transactional
    public PropertyDetailResponse createProperty(PropertyCreateRequest request, Long userId) {
        log.info("Creating property with slug: {}", request.getSlug());

        // Validate slug uniqueness
        if (propertyRepository.existsBySlug(request.getSlug())) {
            throw new DuplicateResourceException("Property", "slug", request.getSlug());
        }

        // Validate business rules
        validatePropertyRequest(request);

        // Get user
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Create property entity
        Property property = propertyMapper.toEntity(request);
        property.setCreatedBy(user);
        property.setUpdatedBy(user);
        property.setSlug(DtoUtils.sanitizeSlug(request.getSlug()));

        // Save property first
        property = propertyRepository.save(property);

        // Save translations
        savePropertyTranslations(property, request.getTranslations());

        // Save amenities if provided
        if (request.getAmenityIds() != null && !request.getAmenityIds().isEmpty()) {
            savePropertyAmenities(property, request.getAmenityIds());
        }

        log.info("Property created successfully with ID: {}", property.getId());
        return propertyMapper.toDetailResponse(property, Locale.VI);
    }

    @Override
    @Transactional
    public PropertyDetailResponse updateProperty(Long id, PropertyUpdateRequest request, Long userId) {
        log.info("Updating property ID: {}", id);

        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));

        // Validate slug uniqueness if changed
        if (request.getSlug() != null && !request.getSlug().equals(property.getSlug())) {
            if (propertyRepository.existsBySlugAndIdNot(request.getSlug(), id)) {
                throw new DuplicateResourceException("Property", "slug", request.getSlug());
            }
        }

        // Get user
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Update property entity
        propertyMapper.updateEntity(property, request);
        property.setUpdatedBy(user);

        if (request.getSlug() != null) {
            property.setSlug(DtoUtils.sanitizeSlug(request.getSlug()));
        }

        // Save property
        property = propertyRepository.save(property);

        // Update translations if provided
        if (request.getTranslations() != null) {
            savePropertyTranslations(property, request.getTranslations());
        }

        // Update amenities if provided
        if (request.getAmenityIds() != null) {
            propertyAmenityRepository.deleteByPropertyId(property.getId());
            if (!request.getAmenityIds().isEmpty()) {
                savePropertyAmenities(property, request.getAmenityIds());
            }
        }

        log.info("Property updated successfully: {}", id);
        return propertyMapper.toDetailResponse(property, Locale.VI);
    }

    @Override
    @Transactional
    public void deleteProperty(Long id) {
        log.info("Deleting property ID: {}", id);

        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));

        // Soft delete by changing status
        property.setStatus(PropertyStatus.HIDDEN);
        propertyRepository.save(property);

        log.info("Property soft deleted: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isSlugAvailable(String slug, Long excludeId) {
        return excludeId != null
                ? !propertyRepository.existsBySlugAndIdNot(slug, excludeId)
                : !propertyRepository.existsBySlug(slug);
    }

    // Helper methods
    private void validatePropertyRequest(PropertyCreateRequest request) {
        Map<String, String> errors = new HashMap<>();

        // Validate area constraints
        if (request.getAreaSqm() != null) {
            if (request.getAreaSqm().compareTo(BusinessConstants.MIN_PROPERTY_AREA) < 0) {
                errors.put("areaSqm", "Area must be at least " + BusinessConstants.MIN_PROPERTY_AREA + " sqm");
            }
            if (request.getAreaSqm().compareTo(BusinessConstants.MAX_PROPERTY_AREA) > 0) {
                errors.put("areaSqm", "Area cannot exceed " + BusinessConstants.MAX_PROPERTY_AREA + " sqm");
            }
        }

        // Validate room constraints
        if (request.getBedrooms() != null) {
            if (request.getBedrooms() < BusinessConstants.MIN_BEDROOMS ||
                    request.getBedrooms() > BusinessConstants.MAX_BEDROOMS) {
                errors.put("bedrooms", "Bedrooms must be between " +
                        BusinessConstants.MIN_BEDROOMS + " and " + BusinessConstants.MAX_BEDROOMS);
            }
        }

        if (!errors.isEmpty()) {
            throw new ValidationException("Property validation failed", errors);
        }
    }

    private void savePropertyTranslations(Property property, Map<String, PropertyTranslationRequest> translations) {
        // Delete existing translations
        propertyI18nRepository.deleteByPropertyId(property.getId());

        // Save new translations
        for (Map.Entry<String, PropertyTranslationRequest> entry : translations.entrySet()) {
            try {
                Locale locale = Locale.fromCode(entry.getKey());
                PropertyTranslationRequest translation = entry.getValue();

                PropertyI18n propertyI18n = PropertyI18n.builder()
                        .id(new PropertyI18nId(property.getId(), locale))
                        .property(property)
                        .title(translation.getTitle())
                        .descriptionMd(translation.getDescriptionMd())
                        .addressText(translation.getAddressText())
                        .build();

                propertyI18nRepository.save(propertyI18n);
            } catch (IllegalArgumentException e) {
                log.warn("Invalid locale in translation: {}", entry.getKey());
            }
        }
    }

    private void savePropertyAmenities(Property property, List<Short> amenityIds) {
        for (Short amenityId : amenityIds) {
            if (amenityRepository.existsById(amenityId)) {
                PropertyAmenity propertyAmenity = PropertyAmenity.builder()
                        .id(new PropertyAmenityId(property.getId(), amenityId))
                        .property(property)
                        .amenity(amenityRepository.getReferenceById(amenityId))
                        .build();

                propertyAmenityRepository.save(propertyAmenity);
            }
        }
    }

    private boolean hasOnlyQuery(PropertySearchRequest request) {
        return request.getQuery() != null &&
                request.getPropertyType() == null &&
                request.getMinPrice() == null && request.getMaxPrice() == null &&
                request.getMinArea() == null && request.getMaxArea() == null &&
                request.getMinBedrooms() == null && request.getMaxBedrooms() == null &&
                request.getIsFeatured() == null;
    }

    private boolean hasOnlyPriceFilter(PropertySearchRequest request) {
        return (request.getMinPrice() != null || request.getMaxPrice() != null) &&
                request.getQuery() == null &&
                request.getPropertyType() == null &&
                request.getMinArea() == null && request.getMaxArea() == null &&
                request.getMinBedrooms() == null && request.getMaxBedrooms() == null &&
                request.getIsFeatured() == null;
    }
}