package com.katya.app.service.impl;

import com.katya.app.dto.mapper.UserMapper;
import com.katya.app.dto.request.SiteSettingUpdateRequest;
import com.katya.app.dto.response.SiteSettingResponse;
import com.katya.app.exception.FileUploadException;
import com.katya.app.exception.ResourceNotFoundException;
import com.katya.app.model.entity.AppUser;
import com.katya.app.model.entity.SiteSetting;
import com.katya.app.model.entity.SiteSettingI18n;
import com.katya.app.model.embeddable.SiteSettingI18nId;
import com.katya.app.repository.AppUserRepository;
import com.katya.app.repository.SiteSettingI18nRepository;
import com.katya.app.repository.SiteSettingRepository;
import com.katya.app.service.CloudinaryService;
import com.katya.app.service.SiteSettingService;
import com.katya.app.util.DtoUtils;
import com.katya.app.util.enums.Locale;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SiteSettingServiceImpl implements SiteSettingService {

    private final SiteSettingRepository siteSettingRepository;
    private final SiteSettingI18nRepository siteSettingI18nRepository;
    private final AppUserRepository userRepository;
    private final UserMapper userMapper;
    private final CloudinaryService cloudinaryService;

    @Override
    @Transactional(readOnly = true)
    public Map<String, String> getCompanyInfo(Locale locale) {
        locale = DtoUtils.parseLocale(locale.getCode(), Locale.VI);

        // Thêm hero_image_url vào list
        List<SiteSetting> companySettings = siteSettingRepository.findCompanyInfoSettings();

        // Cũng lấy hero image setting
        SiteSetting heroImageSetting = siteSettingRepository.findByKey("hero_image_url").orElse(null);

        Map<String, String> result = new HashMap<>();

        for (SiteSetting setting : companySettings) {
            result.put(setting.getKey(), setting.getDisplayValue(locale));
        }

        // Thêm hero image URL vào response
        if (heroImageSetting != null) {
            result.put("hero_image_url", heroImageSetting.getDisplayValue(locale));
        } else {
            result.put("hero_image_url", ""); // Default empty
        }

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public String getSettingValue(String key, Locale locale) {
        locale = DtoUtils.parseLocale(locale.getCode(), Locale.VI);

        SiteSetting setting = siteSettingRepository.findByKey(key)
                .orElse(null);

        return setting != null ? setting.getDisplayValue(locale) : null;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SiteSettingResponse> getAllSettings(Locale locale) {
        locale = DtoUtils.parseLocale(locale.getCode(), Locale.VI);

        List<SiteSetting> settings = siteSettingRepository.findAllOrdered();
        Locale finalLocale = locale;
        return settings.stream()
                .map(setting -> buildSiteSettingResponse(setting, finalLocale))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SiteSettingResponse getSettingByKey(String key, Locale locale) {
        locale = DtoUtils.parseLocale(locale.getCode(), Locale.VI);

        SiteSetting setting = siteSettingRepository.findByKey(key)
                .orElseThrow(() -> new ResourceNotFoundException("SiteSetting", "key", key));

        return buildSiteSettingResponse(setting, locale);
    }

    @Override
    @Transactional
    public SiteSettingResponse updateSetting(String key, SiteSettingUpdateRequest request, Long updatedByUserId) {
        log.info("Updating site setting: {}", key);

        AppUser updatedBy = userRepository.findById(updatedByUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", updatedByUserId));

        SiteSetting setting = siteSettingRepository.findByKey(key)
                .orElse(SiteSetting.builder()
                        .key(key)
                        .build());

        // Update default value if provided
        if (request.getValue() != null) {
            setting.setValue(request.getValue());
        }

        setting.setUpdatedAt(LocalDateTime.now());
        setting.setUpdatedBy(updatedBy);

        setting = siteSettingRepository.save(setting);

        // Update translations if provided
        if (request.getTranslations() != null) {
            for (Map.Entry<String, String> entry : request.getTranslations().entrySet()) {
                try {
                    Locale locale = Locale.fromCode(entry.getKey());

                    SiteSettingI18n i18n = siteSettingI18nRepository
                            .findBySettingKeyAndLocale(key, locale)
                            .orElse(SiteSettingI18n.builder()
                                    .id(new SiteSettingI18nId(key, locale))
                                    .siteSetting(setting)
                                    .build());

                    i18n.setValue(entry.getValue());
                    siteSettingI18nRepository.save(i18n);

                } catch (IllegalArgumentException e) {
                    log.warn("Invalid locale in translation: {}", entry.getKey());
                }
            }
        }

        log.info("Site setting updated successfully: {}", key);
        return buildSiteSettingResponse(setting, Locale.VI);
    }

    @Override
    @Transactional
    public void initializeDefaultSettings() {
        log.info("Initializing default site settings");

        Map<String, String> defaultSettings = Map.of(
                "company_name", "Q Apartment",
                "company_phone", "0903228571",
                "company_email", "q.apartment09hbm@gmail.com",
                "company_zalo", "0903228571",
                "company_address", "Hanoi, Vietnam",
                "site_title", "Q Apartment - Quality Housing Solutions",
                "site_description", "Find quality apartments and rooms for rent in Hanoi",
                "contact_form_email", "q.apartment09hbm@gmail.com",
                "hero_image_url", ""
        );

        for (Map.Entry<String, String> entry : defaultSettings.entrySet()) {
            if (!siteSettingRepository.existsByKey(entry.getKey())) {
                SiteSetting setting = SiteSetting.builder()
                        .key(entry.getKey())
                        .value(entry.getValue())
                        .updatedAt(LocalDateTime.now())
                        .build();

                siteSettingRepository.save(setting);
            }
        }

        log.info("Default site settings initialized");
    }

    @Transactional
    @Override
    public String uploadHeroImage(MultipartFile file, Long userId) {
        log.info("Uploading hero image");

        try {
            // Upload to Cloudinary
            Map<String, Object> uploadResult = cloudinaryService.uploadImage(file, "hero");
            String imageUrl = (String) uploadResult.get("secure_url");

            // Update hero_image_url setting
            AppUser user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

            SiteSetting setting = siteSettingRepository.findByKey("hero_image_url")
                    .orElse(SiteSetting.builder()
                            .key("hero_image_url")
                            .build());

            setting.setValue(imageUrl);
            setting.setUpdatedAt(LocalDateTime.now());
            setting.setUpdatedBy(user);

            siteSettingRepository.save(setting);

            log.info("Hero image uploaded successfully: {}", imageUrl);
            return imageUrl;

        } catch (Exception e) {
            log.error("Failed to upload hero image: {}", e.getMessage(), e);
            throw new FileUploadException("Failed to upload hero image: " + e.getMessage());
        }
    }



    private SiteSettingResponse buildSiteSettingResponse(SiteSetting setting, Locale locale) {
        Map<String, String> translations = new HashMap<>();

        for (SiteSettingI18n translation : setting.getTranslations()) {
            translations.put(translation.getLocale().getCode(), translation.getValue());
        }

        return SiteSettingResponse.builder()
                .key(setting.getKey())
                .value(setting.getValue())
                .displayValue(setting.getDisplayValue(locale))
                .translations(translations)
                .updatedAt(setting.getUpdatedAt())
                .updatedBy(userMapper.toSummaryResponse(setting.getUpdatedBy()))
                .build();
    }
}
