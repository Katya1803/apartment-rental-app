package com.katya.app.controller.admin;

import com.katya.app.dto.common.ApiResponse;
import com.katya.app.dto.common.PageResponse;
import com.katya.app.dto.request.ContentPageCreateRequest;
import com.katya.app.dto.request.ContentPageUpdateRequest;
import com.katya.app.dto.response.ContentPageResponse;
import com.katya.app.security.UserPrincipal;
import com.katya.app.service.ContentPageService;
import com.katya.app.util.DtoUtils;
import com.katya.app.util.ResponseBuilder;
import com.katya.app.util.constant.ApiEndpoints;
import com.katya.app.util.constant.AppConstants;
import com.katya.app.util.enums.Locale;
import com.katya.app.util.enums.PropertyStatus;
import com.katya.app.util.validation.ValidLocale;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiEndpoints.ADMIN_CONTENT)
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'EDITOR')")
public class AdminContentController {

    private final ContentPageService contentPageService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ContentPageResponse>>> getAllPages(
            @RequestParam(required = false) PropertyStatus status,
            @RequestParam(required = false, defaultValue = AppConstants.DEFAULT_LOCALE) @ValidLocale String locale,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size) {

        Locale loc = DtoUtils.parseLocale(locale, Locale.VI);
        Page<ContentPageResponse> pages = contentPageService.getAllPages(status, loc, page, size);
        return ResponseBuilder.page(pages);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ContentPageResponse>> getPageById(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = AppConstants.DEFAULT_LOCALE) @ValidLocale String locale) {

        Locale loc = DtoUtils.parseLocale(locale, Locale.VI);
        ContentPageResponse page = contentPageService.getPageById(id, loc);
        return ResponseBuilder.success(page);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'EDITOR')")
    public ResponseEntity<ApiResponse<ContentPageResponse>> createPage(
            @Valid @RequestBody ContentPageCreateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        ContentPageResponse page = contentPageService.createPage(request, userPrincipal.getId());
        return ResponseBuilder.created(page, AppConstants.SUCCESS_CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'EDITOR')")
    public ResponseEntity<ApiResponse<ContentPageResponse>> updatePage(
            @PathVariable Long id,
            @Valid @RequestBody ContentPageUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        ContentPageResponse page = contentPageService.updatePage(id, request, userPrincipal.getId());
        return ResponseBuilder.success(page, AppConstants.SUCCESS_UPDATED);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<String>> deletePage(@PathVariable Long id) {
        contentPageService.deletePage(id);
        return ResponseBuilder.success(AppConstants.SUCCESS_DELETED);
    }

    @GetMapping("/slug/{slug}/available")
    public ResponseEntity<ApiResponse<Boolean>> checkSlugAvailability(
            @PathVariable String slug,
            @RequestParam(required = false) Long excludeId) {

        boolean available = contentPageService.isSlugAvailable(slug, excludeId);
        return ResponseBuilder.success(available);
    }
}