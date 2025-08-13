package com.katya.app.service;

import com.katya.app.dto.response.AmenityResponse;
import com.katya.app.util.enums.Locale;
import com.katya.app.util.enums.PropertyType;

import java.util.List;

public interface AmenityService {

    List<AmenityResponse> getAllAmenities(Locale locale);

    List<AmenityResponse> getAmenitiesForPropertyType(PropertyType propertyType, Locale locale);

    AmenityResponse getAmenityById(Short id, Locale locale);
}