package com.katya.app.controller.page;

import com.katya.app.dto.common.ApiResponse;
import com.katya.app.dto.response.ContentPageResponse;
import com.katya.app.service.ContentPageService;
import com.katya.app.util.DtoUtils;
import com.katya.app.util.ResponseBuilder;
import com.katya.app.util.constant.ApiEndpoints;
import com.katya.app.util.constant.AppConstants;
import com.katya.app.util.enums.Locale;
import com.katya.app.util.validation.ValidLocale;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiEndpoints.CONTENT)
@RequiredArgsConstructor
public class ContentController {

    private final ContentPageService contentPageService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ContentPageResponse>>> getPublishedPages(
            @RequestParam(required = false, defaultValue = AppConstants.DEFAULT_LOCALE) @ValidLocale String locale) {

        Locale loc = DtoUtils.parseLocale(locale, Locale.VI);
        List<ContentPageResponse> pages = contentPageService.getPublishedPages(loc);
        return ResponseBuilder.success(pages);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<ContentPageResponse>> getPageBySlug(
            @PathVariable String slug,
            @RequestParam(required = false, defaultValue = AppConstants.DEFAULT_LOCALE) @ValidLocale String locale) {

        Locale loc = DtoUtils.parseLocale(locale, Locale.VI);
        ContentPageResponse page = contentPageService.getPageBySlug(slug, loc);
        return ResponseBuilder.success(page);
    }
}