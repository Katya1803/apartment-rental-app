package com.katya.app.controller.admin;

import com.katya.app.dto.common.ApiResponse;
import com.katya.app.dto.request.SiteSettingUpdateRequest;
import com.katya.app.dto.response.SiteSettingResponse;
import com.katya.app.security.UserPrincipal;
import com.katya.app.service.SiteSettingService;
import com.katya.app.util.DtoUtils;
import com.katya.app.util.ResponseBuilder;
import com.katya.app.util.constant.ApiEndpoints;
import com.katya.app.util.constant.AppConstants;
import com.katya.app.util.enums.Locale;
import com.katya.app.util.validation.ValidLocale;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiEndpoints.ADMIN_SITE_SETTINGS)
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminSiteSettingController {

    private final SiteSettingService siteSettingService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SiteSettingResponse>>> getAllSettings(
            @RequestParam(required = false, defaultValue = AppConstants.DEFAULT_LOCALE) @ValidLocale String locale) {

        Locale loc = DtoUtils.parseLocale(locale, Locale.VI);
        List<SiteSettingResponse> settings = siteSettingService.getAllSettings(loc);
        return ResponseBuilder.success(settings);
    }

    @GetMapping("/{key}")
    public ResponseEntity<ApiResponse<SiteSettingResponse>> getSettingByKey(
            @PathVariable String key,
            @RequestParam(required = false, defaultValue = AppConstants.DEFAULT_LOCALE) @ValidLocale String locale) {

        Locale loc = DtoUtils.parseLocale(locale, Locale.VI);
        SiteSettingResponse setting = siteSettingService.getSettingByKey(key, loc);
        return ResponseBuilder.success(setting);
    }

    @PutMapping("/{key}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<SiteSettingResponse>> updateSetting(
            @PathVariable String key,
            @Valid @RequestBody SiteSettingUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        SiteSettingResponse setting = siteSettingService.updateSetting(key, request, userPrincipal.getId());
        return ResponseBuilder.success(setting, AppConstants.SUCCESS_UPDATED);
    }

    @PostMapping("/initialize")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<String>> initializeDefaultSettings() {
        siteSettingService.initializeDefaultSettings();
        return ResponseBuilder.success("Default settings initialized successfully");
    }
}
