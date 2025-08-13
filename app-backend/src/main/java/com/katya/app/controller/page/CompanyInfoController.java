package com.katya.app.controller.page;

import com.katya.app.dto.common.ApiResponse;
import com.katya.app.service.SiteSettingService;
import com.katya.app.util.DtoUtils;
import com.katya.app.util.ResponseBuilder;
import com.katya.app.util.constant.ApiEndpoints;
import com.katya.app.util.constant.AppConstants;
import com.katya.app.util.enums.Locale;
import com.katya.app.util.validation.ValidLocale;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(ApiEndpoints.COMPANY_INFO)
@RequiredArgsConstructor
public class CompanyInfoController {

    private final SiteSettingService siteSettingService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, String>>> getCompanyInfo(
            @RequestParam(required = false, defaultValue = AppConstants.DEFAULT_LOCALE) @ValidLocale String locale) {

        Locale loc = DtoUtils.parseLocale(locale, Locale.VI);
        Map<String, String> companyInfo = siteSettingService.getCompanyInfo(loc);
        return ResponseBuilder.success(companyInfo);
    }

    @GetMapping("/{key}")
    public ResponseEntity<ApiResponse<String>> getSettingValue(
            @PathVariable String key,
            @RequestParam(required = false, defaultValue = AppConstants.DEFAULT_LOCALE) @ValidLocale String locale) {

        Locale loc = DtoUtils.parseLocale(locale, Locale.VI);
        String value = siteSettingService.getSettingValue(key, loc);
        return ResponseBuilder.success(value);
    }
}
