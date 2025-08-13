package com.katya.app.service.impl;

import com.katya.app.dto.response.AmenityResponse;
import com.katya.app.exception.ResourceNotFoundException;
import com.katya.app.model.entity.Amenity;
import com.katya.app.model.entity.AmenityI18n;
import com.katya.app.repository.AmenityRepository;
import com.katya.app.service.AmenityService;
import com.katya.app.util.DtoUtils;
import com.katya.app.util.enums.Locale;
import com.katya.app.util.enums.PropertyType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AmenityServiceImpl implements AmenityService {

    private final AmenityRepository amenityRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AmenityResponse> getAllAmenities(Locale locale) {
        locale = DtoUtils.parseLocale(locale.getCode(), Locale.VI);

        List<Amenity> amenities = amenityRepository.findAllOrdered();
        Locale finalLocale = locale;
        return amenities.stream()
                .map(amenity -> buildAmenityResponse(amenity, finalLocale))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AmenityResponse> getAmenitiesForPropertyType(PropertyType propertyType, Locale locale) {
        locale = DtoUtils.parseLocale(locale.getCode(), Locale.VI);

        List<Amenity> amenities;

        if (PropertyType.ROOM.equals(propertyType)) {
            amenities = amenityRepository.findRoomAmenities();
        } else {
            amenities = amenityRepository.findCommonAmenities();
        }

        Locale finalLocale = locale;
        return amenities.stream()
                .map(amenity -> buildAmenityResponse(amenity, finalLocale))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AmenityResponse getAmenityById(Short id, Locale locale) {
        locale = DtoUtils.parseLocale(locale.getCode(), Locale.VI);

        Amenity amenity = amenityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Amenity", "id", id));

        return buildAmenityResponse(amenity, locale);
    }

    private AmenityResponse buildAmenityResponse(Amenity amenity, Locale locale) {
        Map<String, String> translations = new HashMap<>();

        for (AmenityI18n translation : amenity.getTranslations()) {
            translations.put(translation.getLocale().getCode(), translation.getLabel());
        }

        return AmenityResponse.builder()
                .id(amenity.getId())
                .key(amenity.getKey())
                .label(amenity.getDisplayLabel(locale))
                .translations(translations)
                .isRoomAmenity(amenity.isRoomAmenity())
                .isCommonAmenity(amenity.isCommonAmenity())
                .build();
    }
}