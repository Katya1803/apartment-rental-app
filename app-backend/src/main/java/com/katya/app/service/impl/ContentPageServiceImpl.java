package com.katya.app.service.impl;

import com.katya.app.dto.mapper.ContentPageMapper;
import com.katya.app.dto.request.ContentPageCreateRequest;
import com.katya.app.dto.request.ContentPageTranslationRequest;
import com.katya.app.dto.request.ContentPageUpdateRequest;
import com.katya.app.dto.response.ContentPageResponse;
import com.katya.app.exception.DuplicateResourceException;
import com.katya.app.exception.ResourceNotFoundException;
import com.katya.app.model.embeddable.ContentPageI18nId;
import com.katya.app.model.entity.AppUser;
import com.katya.app.model.entity.ContentPage;
import com.katya.app.model.entity.ContentPageI18n;
import com.katya.app.repository.AppUserRepository;
import com.katya.app.repository.ContentPageI18nRepository;
import com.katya.app.repository.ContentPageRepository;
import com.katya.app.service.ContentPageService;
import com.katya.app.util.DtoUtils;
import com.katya.app.util.enums.Locale;
import com.katya.app.util.enums.PropertyStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContentPageServiceImpl implements ContentPageService {

    private final ContentPageRepository contentPageRepository;
    private final ContentPageI18nRepository contentPageI18nRepository;
    private final AppUserRepository userRepository;
    private final ContentPageMapper contentPageMapper;

    @Override
    @Transactional(readOnly = true)
    public List<ContentPageResponse> getPublishedPages(Locale locale) {
        locale = DtoUtils.parseLocale(locale.getCode(), Locale.VI);

        List<ContentPage> pages = contentPageRepository.findPublishedPages();
        Locale finalLocale = locale;
        return pages.stream()
                .map(page -> contentPageMapper.toResponse(page, finalLocale))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ContentPageResponse getPageBySlug(String slug, Locale locale) {
        locale = DtoUtils.parseLocale(locale.getCode(), Locale.VI);

        ContentPage page = contentPageRepository.findBySlugAndStatus(slug, PropertyStatus.PUBLISHED)
                .orElseThrow(() -> new ResourceNotFoundException("ContentPage", "slug", slug));

        return contentPageMapper.toResponse(page, locale);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ContentPageResponse> getAllPages(PropertyStatus status, Locale locale, int page, int size) {
        locale = DtoUtils.parseLocale(locale.getCode(), Locale.VI);
        Pageable pageable = DtoUtils.createPageable(page, size, "createdAt", "desc");

        Page<ContentPage> pages = contentPageRepository.findPagesForAdmin(status, pageable);
        Locale finalLocale = locale;
        return pages.map(contentPage -> contentPageMapper.toResponse(contentPage, finalLocale));
    }

    @Override
    @Transactional(readOnly = true)
    public ContentPageResponse getPageById(Long id, Locale locale) {
        locale = DtoUtils.parseLocale(locale.getCode(), Locale.VI);

        ContentPage page = contentPageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ContentPage", "id", id));

        return contentPageMapper.toResponse(page, locale);
    }

    @Override
    @Transactional
    public ContentPageResponse createPage(ContentPageCreateRequest request, Long userId) {
        log.info("Creating content page with slug: {}", request.getSlug());

        // Validate slug uniqueness
        if (contentPageRepository.existsBySlug(request.getSlug())) {
            throw new DuplicateResourceException("ContentPage", "slug", request.getSlug());
        }

        // Get user
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Create content page entity
        ContentPage page = contentPageMapper.toEntity(request);
        page.setCreatedBy(user);
        page.setUpdatedBy(user);
        page.setSlug(DtoUtils.sanitizeSlug(request.getSlug()));

        // Save page first
        page = contentPageRepository.save(page);

        // Save translations
        savePageTranslations(page, request.getTranslations());

        log.info("Content page created successfully with ID: {}", page.getId());
        return contentPageMapper.toResponse(page, Locale.VI);
    }

    @Override
    @Transactional
    public ContentPageResponse updatePage(Long id, ContentPageUpdateRequest request, Long userId) {
        log.info("Updating content page ID: {}", id);

        ContentPage page = contentPageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ContentPage", "id", id));

        // Validate slug uniqueness if changed
        if (request.getSlug() != null && !request.getSlug().equals(page.getSlug())) {
            if (contentPageRepository.existsBySlugAndIdNot(request.getSlug(), id)) {
                throw new DuplicateResourceException("ContentPage", "slug", request.getSlug());
            }
        }

        // Get user
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Update page entity
        if (request.getSlug() != null) {
            page.setSlug(DtoUtils.sanitizeSlug(request.getSlug()));
        }
        if (request.getStatus() != null) {
            page.setStatus(request.getStatus());
        }
        page.setUpdatedBy(user);

        // Save page
        page = contentPageRepository.save(page);

        // Update translations if provided
        if (request.getTranslations() != null) {
            savePageTranslations(page, request.getTranslations());
        }

        log.info("Content page updated successfully: {}", id);
        return contentPageMapper.toResponse(page, Locale.VI);
    }

    @Override
    @Transactional
    public void deletePage(Long id) {
        log.info("Deleting content page ID: {}", id);

        ContentPage page = contentPageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ContentPage", "id", id));

        // Soft delete by changing status
        page.setStatus(PropertyStatus.HIDDEN);
        contentPageRepository.save(page);

        log.info("Content page soft deleted: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isSlugAvailable(String slug, Long excludeId) {
        return excludeId != null
                ? !contentPageRepository.existsBySlugAndIdNot(slug, excludeId)
                : !contentPageRepository.existsBySlug(slug);
    }

    // Helper methods
    private void savePageTranslations(ContentPage page, Map<String, ContentPageTranslationRequest> translations) {
        for (Map.Entry<String, ContentPageTranslationRequest> entry : translations.entrySet()) {
            try {
                Locale locale = Locale.fromCode(entry.getKey());
                ContentPageTranslationRequest translation = entry.getValue();

                // Check if translation already exists
                ContentPageI18n existingI18n = contentPageI18nRepository
                        .findByPageIdAndLocale(page.getId(), locale)
                        .orElse(null);

                ContentPageI18n pageI18n;
                if (existingI18n != null) {
                    // Update existing
                    pageI18n = existingI18n;
                } else {
                    // Create new
                    pageI18n = ContentPageI18n.builder()
                            .id(new ContentPageI18nId(page.getId(), locale))
                            .contentPage(page)
                            .build();
                }

                pageI18n.setTitle(translation.getTitle());
                pageI18n.setBodyMd(translation.getBodyMd());

                contentPageI18nRepository.save(pageI18n);
            } catch (IllegalArgumentException e) {
                log.warn("Invalid locale in translation: {}", entry.getKey());
            }
        }
    }
}