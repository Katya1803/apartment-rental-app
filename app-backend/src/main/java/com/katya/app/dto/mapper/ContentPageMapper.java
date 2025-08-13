package com.katya.app.dto.mapper;

import com.katya.app.dto.request.ContentPageCreateRequest;
import com.katya.app.dto.response.ContentPageResponse;
import com.katya.app.dto.response.ContentPageTranslationResponse;
import com.katya.app.model.entity.ContentPage;
import com.katya.app.model.entity.ContentPageI18n;
import com.katya.app.util.enums.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class ContentPageMapper {

    private final UserMapper userMapper;

    public ContentPage toEntity(ContentPageCreateRequest request) {
        return ContentPage.builder()
                .slug(request.getSlug())
                .status(request.getStatus())
                .build();
    }

    public ContentPageResponse toResponse(ContentPage page, Locale locale) {
        Map<String, ContentPageTranslationResponse> translations = new HashMap<>();

        for (ContentPageI18n i18n : page.getTranslations()) {
            if (i18n.getLocale() != null) {
                translations.put(i18n.getLocale().getCode(),
                        ContentPageTranslationResponse.builder()
                                .title(i18n.getTitle())
                                .bodyMd(i18n.getBodyMd())
                                .build());
            }
        }

        // Get current locale translation for title and preview
        ContentPageI18n currentTranslation = page.getTranslation(locale);
        String title = currentTranslation != null ? currentTranslation.getTitle() : page.getSlug();
        String bodyPreview = currentTranslation != null ? currentTranslation.getBodyPreview(200) : null;

        return ContentPageResponse.builder()
                .id(page.getId())
                .slug(page.getSlug())
                .status(page.getStatus())
                .title(title)
                .bodyPreview(bodyPreview)
                .translations(translations)
                .createdBy(userMapper.toSummaryResponse(page.getCreatedBy()))
                .updatedBy(userMapper.toSummaryResponse(page.getUpdatedBy()))
                .createdAt(page.getCreatedAt())
                .updatedAt(page.getUpdatedAt())
                .build();
    }
}