package com.katya.app.controller.admin;

import com.katya.app.dto.common.ApiResponse;
import com.katya.app.dto.common.PageResponse;
import com.katya.app.dto.request.ImageUploadRequest;
import com.katya.app.dto.request.PropertyCreateRequest;
import com.katya.app.dto.request.PropertySearchRequest;
import com.katya.app.dto.request.PropertyUpdateRequest;
import com.katya.app.dto.response.PropertyDetailResponse;
import com.katya.app.dto.response.PropertyImageResponse;
import com.katya.app.dto.response.PropertySummaryResponse;
import com.katya.app.security.UserPrincipal;
import com.katya.app.service.FileUploadService;
import com.katya.app.service.PropertyService;
import com.katya.app.util.ResponseBuilder;
import com.katya.app.util.constant.ApiEndpoints;
import com.katya.app.util.constant.AppConstants;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping(ApiEndpoints.ADMIN_PROPERTIES)
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'EDITOR')")
public class AdminPropertyController {

    private final PropertyService propertyService;
    private final FileUploadService fileUploadService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<PropertySummaryResponse>>> getPropertiesForAdmin(
            @Valid @ModelAttribute PropertySearchRequest request,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size) {

        Page<PropertySummaryResponse> properties = propertyService.getPropertiesForAdmin(request, page, size);
        return ResponseBuilder.page(properties);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyDetailResponse>> getPropertyForAdmin(@PathVariable Long id) {
        PropertyDetailResponse property = propertyService.getPropertyForAdmin(id);
        return ResponseBuilder.success(property);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'EDITOR')")
    public ResponseEntity<ApiResponse<PropertyDetailResponse>> createProperty(
            @Valid @RequestBody PropertyCreateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        PropertyDetailResponse property = propertyService.createProperty(request, userPrincipal.getId());
        return ResponseBuilder.created(property, AppConstants.SUCCESS_CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'EDITOR')")
    public ResponseEntity<ApiResponse<PropertyDetailResponse>> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody PropertyUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        PropertyDetailResponse property = propertyService.updateProperty(id, request, userPrincipal.getId());
        return ResponseBuilder.success(property, AppConstants.SUCCESS_UPDATED);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseBuilder.success(AppConstants.SUCCESS_DELETED);
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<ApiResponse<List<PropertyImageResponse>>> getPropertyImages(@PathVariable Long id) {
        List<PropertyImageResponse> images = fileUploadService.getPropertyImages(id);
        return ResponseBuilder.success(images);
    }

    @PostMapping("/{id}/images")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'EDITOR')")
    public ResponseEntity<ApiResponse<PropertyImageResponse>> uploadPropertyImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @Valid @ModelAttribute ImageUploadRequest request) {

        PropertyImageResponse image = fileUploadService.uploadPropertyImage(
                id, file, request.getSortOrder(), request.getIsCover());
        return ResponseBuilder.created(image, "Image uploaded successfully");
    }

    @DeleteMapping("/images/{imageId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'EDITOR')")
    public ResponseEntity<ApiResponse<String>> deletePropertyImage(@PathVariable Long imageId) {
        fileUploadService.deletePropertyImage(imageId);
        return ResponseBuilder.success("Image deleted successfully");
    }

    @PatchMapping("/images/{imageId}/sort-order")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'EDITOR')")
    public ResponseEntity<ApiResponse<String>> updateImageSortOrder(
            @PathVariable Long imageId,
            @RequestParam Short sortOrder) {

        fileUploadService.updateImageSortOrder(imageId, sortOrder);
        return ResponseBuilder.success("Sort order updated successfully");
    }

    @PatchMapping("/images/{imageId}/set-cover")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'EDITOR')")
    public ResponseEntity<ApiResponse<String>> setCoverImage(@PathVariable Long imageId) {
        fileUploadService.setCoverImage(imageId);
        return ResponseBuilder.success("Cover image set successfully");
    }

    @GetMapping("/slug/{slug}/available")
    public ResponseEntity<ApiResponse<Boolean>> checkSlugAvailability(
            @PathVariable String slug,
            @RequestParam(required = false) Long excludeId) {

        boolean available = propertyService.isSlugAvailable(slug, excludeId);
        return ResponseBuilder.success(available);
    }
}
