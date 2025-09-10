package com.katya.app.dto.mapper;

import com.katya.app.config.CloudinaryConfig;
import com.katya.app.dto.request.PropertyCreateRequest;
import com.katya.app.dto.request.PropertyTranslationRequest;
import com.katya.app.dto.request.PropertyUpdateRequest;
import com.katya.app.dto.response.*;
import com.katya.app.model.entity.*;
import com.katya.app.util.enums.Locale;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class PropertyMapper {

    private final UserMapper userMapper;
    private final CloudinaryConfig cloudinaryConfig;

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
        try {
            Map<String, PropertyTranslationResponse> translations = new HashMap<>();
            for (PropertyI18n i18n : property.getTranslations()) {
                if (i18n.getLocale() != null) {
                    translations.put(i18n.getLocale().getCode(),
                            PropertyTranslationResponse.builder()
                                    .title(i18n.getTitle())
                                    .descriptionMd(i18n.getDescriptionMd())
                                    .addressText(i18n.getAddressText())
                                    .build());
                }
            }

            List<PropertyImageResponse> imageResponses = property.getImages().stream()
                    .map(this::toImageResponse)
                    .collect(Collectors.toList());

            List<AmenityResponse> amenityResponses = property.getAmenities().stream()
                    .map(propertyAmenity -> {
                        try {
                            Amenity amenity = propertyAmenity.getAmenity();

                            // Build amenity translations map
                            Map<String, String> amenityTranslations = new HashMap<>();
                            if (amenity.getTranslations() != null) {
                                for (AmenityI18n translation : amenity.getTranslations()) {
                                    if (translation.getLocale() != null && translation.getLabel() != null) {
                                        amenityTranslations.put(translation.getLocale().getCode(), translation.getLabel());
                                    }
                                }
                            }

                            return AmenityResponse.builder()
                                    .id(amenity.getId())
                                    .key(amenity.getKey())
                                    .label(amenity.getDisplayLabel(locale))
                                    .translations(amenityTranslations)
                                    .isRoomAmenity(amenity.isRoomAmenity())
                                    .isCommonAmenity(amenity.isCommonAmenity())
                                    .build();
                        } catch (Exception e) {
                            log.warn("Error mapping amenity for property {}: {}", property.getId(), e.getMessage());
                            // Return basic amenity info as fallback
                            Amenity amenity = propertyAmenity.getAmenity();
                            return AmenityResponse.builder()
                                    .id(amenity.getId())
                                    .key(amenity.getKey())
                                    .label(amenity.getKey()) // Fallback to key
                                    .translations(new HashMap<>())
                                    .isRoomAmenity(false)
                                    .isCommonAmenity(true)
                                    .build();
                        }
                    })
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
                    .amenities(amenityResponses)  // Now properly mapped
                    .createdBy(userMapper.toSummaryResponse(property.getCreatedBy()))
                    .updatedBy(userMapper.toSummaryResponse(property.getUpdatedBy()))
                    .totalImages(property.getImages().size())
                    .totalAmenities(property.getAmenities().size())
                    .totalInquiries(property.getContactMessages().size())
                    .build();

        } catch (Exception e) {
            log.error("Error mapping property {} to detail response: {}", property.getId(), e.getMessage(), e);
            throw new RuntimeException("Failed to map property to response", e);
        }
    }


    public PropertyImageResponse toImageResponse(PropertyImage image) {
        if (image == null) {
            return null;
        }

        // Build imageUrl - handle both Cloudinary and local files
        String imageUrl;
        if (image.getFilePath() != null) {
            if (image.getFilePath().startsWith("http")) {
                // Already a full Cloudinary URL
                imageUrl = image.getFilePath();
            } else if (image.getFilePath().contains("/")) {
                // Cloudinary public_id format, construct URL
                imageUrl = "https://res.cloudinary.com/" + cloudinaryConfig.getCloudName() + "/image/upload/" + image.getFilePath();
            } else {
                // Local file, use existing logic
                imageUrl = image.getImageUrl();
            }
        } else {
            imageUrl = "/images/placeholder.jpg";
        }

        return PropertyImageResponse.builder()
                .id(image.getId())
                .filePath(image.getFilePath())
                .imageUrl(imageUrl)
                .mimeType(image.getMimeType())
                .fileSize(image.getFileSize())
                .fileSizeFormatted(image.getImageSizeFormatted())
                .sortOrder(image.getSortOrder())
                .isCover(image.getIsCover())
                .build();
    }

    private String truncateText(String text, int maxLength) {
        if (text == null || text.length() <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + "...";
    }


    private PropertyI18n getTranslationSafe(Property property, Locale locale) {
        try {
            PropertyI18n translation = property.getTranslation(locale);
            if (translation != null) {
                return translation;
            }

            // Fallback to Vietnamese
            translation = property.getTranslation(Locale.VI);
            if (translation != null) {
                return translation;
            }

            if (!property.getTranslations().isEmpty()) {
                return property.getTranslations().get(0);
            }

            return null;
        } catch (Exception e) {
            log.warn("Error getting translation for property {}: {}", property.getId(), e.getMessage());
            return null;
        }
    }


    private PropertyImage getCoverImageSafe(Property property) {
        try {
            PropertyImage coverImage = property.getCoverImage();
            if (coverImage != null) {
                return coverImage;
            }

            // Fallback to first image
            if (!property.getImages().isEmpty()) {
                return property.getImages().stream()
                        .min((img1, img2) -> Short.compare(img1.getSortOrder(), img2.getSortOrder()))
                        .orElse(property.getImages().get(0));
            }

            return null;
        } catch (Exception e) {
            log.warn("Error getting cover image for property {}: {}", property.getId(), e.getMessage());
            return null;
        }
    }


    private PropertyTranslationResponse buildTranslationResponse(PropertyI18n translation) {
        if (translation == null) {
            return null;
        }

        return PropertyTranslationResponse.builder()
                .title(translation.getTitle())
                .descriptionMd(translation.getDescriptionMd())
                .addressText(translation.getAddressText())
                .build();
    }


    public PropertySummaryResponse toSummaryResponseSafe(Property property, Locale locale) {
        try {
            PropertyI18n translation = getTranslationSafe(property, locale);
            PropertyImage coverImage = getCoverImageSafe(property);

            return PropertySummaryResponse.builder()
                    .id(property.getId())
                    .slug(property.getSlug())
                    .code(property.getCode())
                    .propertyType(property.getPropertyType())
                    .title(translation != null ? translation.getTitle() :
                            (property.getCode() != null ? property.getCode() : "Property " + property.getId()))
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
        } catch (Exception e) {
            log.error("Error mapping property {} to summary response: {}", property.getId(), e.getMessage(), e);
            // Return minimal response as fallback
            return PropertySummaryResponse.builder()
                    .id(property.getId())
                    .slug(property.getSlug())
                    .code(property.getCode())
                    .propertyType(property.getPropertyType())
                    .title("Property " + property.getId())
                    .priceMonth(property.getPriceMonth())
                    .status(property.getStatus())
                    .isFeatured(property.getIsFeatured())
                    .createdAt(property.getCreatedAt())
                    .updatedAt(property.getUpdatedAt())
                    .build();
        }
    }
}