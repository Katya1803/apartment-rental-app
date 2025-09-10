package com.katya.app.service;

import com.katya.app.dto.request.SiteSettingUpdateRequest;
import com.katya.app.dto.response.SiteSettingResponse;
import com.katya.app.util.enums.Locale;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface SiteSettingService {

    // Public API
    Map<String, String> getCompanyInfo(Locale locale);

    String getSettingValue(String key, Locale locale);

    // Admin APIs
    List<SiteSettingResponse> getAllSettings(Locale locale);

    SiteSettingResponse getSettingByKey(String key, Locale locale);

    SiteSettingResponse updateSetting(String key, SiteSettingUpdateRequest request, Long updatedByUserId);

    void initializeDefaultSettings();

    @Transactional
    String uploadHeroImage(MultipartFile file, Long userId);
}