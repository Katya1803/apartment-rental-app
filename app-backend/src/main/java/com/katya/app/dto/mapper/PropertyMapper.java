package com.katya.app.dto.mapper;

import com.katya.app.dto.request.PropertyCreateRequest;
import com.katya.app.dto.request.PropertyTranslationRequest;
import com.katya.app.dto.request.PropertyUpdateRequest;
import com.katya.app.dto.response.*;
import com.katya.app.model.entity.Property;
import com.katya.app.model.entity.PropertyI18n;
import com.katya.app.model.entity.PropertyImage;
import com.katya.app.util.enums.Locale;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class PropertyMapper {

    public Property toEntity(PropertyCreateRequest request) {
        Property property = Property.builder()
                .slug(request.getSlug())
                .code(request.getCode())
                .propertyType(request.getPropertyType())
                .priceMonth(request.getPriceMonth())
                .areaSqm(request.getAreaSqm())
                .bedrooms(request.getBedrooms())
                .bathrooms(request.getBathrooms())
                .floorNo(request.getFloorNo())
                .petPolicy(request.getPetPolicy())
                .viewDesc(request.getViewDesc())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .addressLine(request.getAddressLine())
                .status(request.getStatus())
                .isFeatured(request.getIsFeatured())
                .build();

        // Set published date if status is PUBLISHED
        if (request.getStatus().name().equals("PUBLISHED")) {
            property.setPublishedAt(LocalDateTime.now());
        }

        return property;
    }

    public void updateEntity(Property property, PropertyUpdateRequest request) {
        if (request.getSlug() != null) property.setSlug(request.getSlug());
        if (request.getCode() != null) property.setCode(request.getCode());
        if (request.getPropertyType() != null) property.setPropertyType(request.getPropertyType());
        if (request.getPriceMonth() != null) property.setPriceMonth(request.getPriceMonth());
        if (request.getAreaSqm() != null) property.setAreaSqm(request.getAreaSqm());
        if (request.getBedrooms() != null) property.setBedrooms(request.getBedrooms());
        if (request.getBathrooms() != null) property.setBathrooms(request.getBathrooms());
        if (request.getFloorNo() != null) property.setFloorNo(request.getFloorNo());
        if (request.getPetPolicy() != null) property.setPetPolicy(request.getPetPolicy());
        if (request.getViewDesc() != null) property.setViewDesc(request.getViewDesc());
        if (request.getLatitude() != null) property.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) property.setLongitude(request.getLongitude());
        if (request.getAddressLine() != null) property.setAddressLine(request.getAddressLine());
        if (request.getStatus() != null) {
            property.setStatus(request.getStatus());
            // Set published date when first published
            if (request.getStatus().name().equals("PUBLISHED") && property.getPublishedAt() == null) {
                property.setPublishedAt(LocalDateTime.now());
            }
        }
        if (request.getIsFeatured() != null) property.setIsFeatured(request.getIsFeatured());
    }

    public PropertySummaryResponse toSummaryResponse(Property property, Locale locale) {
        PropertyI18n translation = property.getTranslation(locale);
        PropertyImage coverImage = property.getCoverImage();

        return PropertySummaryResponse.builder()
                .id(property.getId())
                .slug(property.getSlug())
                .code(property.getCode())
                .propertyType(property.getPropertyType())
                .title(translation != null ? translation.getTitle() : property.getSlug())
                .shortDescription(translation != null && translation.getDescriptionMd() != null ?
                        truncateText(translation.getDescriptionMd(), 150) : null)
                .priceMonth(property.getPriceMonth())
                .areaSqm(property.getAreaSqm())
                .bedrooms(property.getBedrooms())
                .bathrooms(property.getBathrooms())
                .addressText(translation != null ? translation.getAddressText() : property.getAddressLine())
                .coverImageUrl(coverImage != null ? coverImage.getImageUrl() : null)
                .status(property.getStatus())
                .isFeatured(property.getIsFeatured())
                .publishedAt(property.getPublishedAt())
                .createdAt(property.getCreatedAt())
                .updatedAt(property.getUpdatedAt())
                .build();
    }

    public PropertyDetailResponse toDetailResponse(Property property, Locale locale) {
        Map<String, PropertyTranslationResponse> translations = new HashMap<>();

        for (PropertyI18n i18n : property.getTranslations()) {
            translations.put(i18n.getLocale().getCode(),
                    PropertyTranslationResponse.builder()
                            .title(i18n.getTitle())
                            .descriptionMd(i18n.getDescriptionMd())
                            .addressText(i18n.getAddressText())
                            .build());
        }

        List<PropertyImageResponse> imageResponses = property.getImages().stream()
                .map(this::toImageResponse)
                .collect(Collectors.toList());

        return PropertyDetailResponse.builder()
                .id(property.getId())
                .slug(property.getSlug())
                .code(property.getCode())
                .propertyType(property.getPropertyType())
                .priceMonth(property.getPriceMonth())
                .areaSqm(property.getAreaSqm())
                .bedrooms(property.getBedrooms())
                .bathrooms(property.getBathrooms())
                .floorNo(property.getFloorNo())
                .petPolicy(property.getPetPolicy())
                .viewDesc(property.getViewDesc())
                .latitude(property.getLatitude())
                .longitude(property.getLongitude())
                .addressLine(property.getAddressLine())
                .status(property.getStatus())
                .isFeatured(property.getIsFeatured())
                .publishedAt(property.getPublishedAt())
                .createdAt(property.getCreatedAt())
                .updatedAt(property.getUpdatedAt())
                .translations(translations)
                .images(imageResponses)
                .totalImages(property.getImages().size())
                .totalAmenities(property.getAmenities().size())
                .totalInquiries(property.getContactMessages().size())
                .build();
    }

    public PropertyImageResponse toImageResponse(PropertyImage image) {
        return PropertyImageResponse.builder()
                .id(image.getId())
                .filePath(image.getFilePath())
                .imageUrl(image.getImageUrl())
                .mimeType(image.getMimeType())
                .fileSize(image.getFileSize())
                .fileSizeFormatted(image.getImageSizeFormatted())
                .sortOrder(image.getSortOrder())
                .isCover(image.getIsCover())
                .build();
    }

    private String truncateText(String text, int maxLength) {
        if (text == null || text.length() <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    }
}
