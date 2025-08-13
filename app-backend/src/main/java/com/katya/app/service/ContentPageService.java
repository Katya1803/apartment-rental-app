package com.katya.app.service;

import com.katya.app.dto.request.ContentPageCreateRequest;
import com.katya.app.dto.request.ContentPageUpdateRequest;
import com.katya.app.dto.response.ContentPageResponse;
import com.katya.app.util.enums.Locale;
import com.katya.app.util.enums.PropertyStatus;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ContentPageService {

    // Public APIs
    List<ContentPageResponse> getPublishedPages(Locale locale);

    ContentPageResponse getPageBySlug(String slug, Locale locale);

    // Admin APIs
    Page<ContentPageResponse> getAllPages(PropertyStatus status, Locale locale, int page, int size);

    ContentPageResponse getPageById(Long id, Locale locale);

    ContentPageResponse createPage(ContentPageCreateRequest request, Long userId);

    ContentPageResponse updatePage(Long id, ContentPageUpdateRequest request, Long userId);

    void deletePage(Long id);

    // Utility methods
    boolean isSlugAvailable(String slug, Long excludeId);
}