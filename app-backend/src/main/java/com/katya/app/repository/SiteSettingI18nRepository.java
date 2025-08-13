package com.katya.app.repository;

import com.katya.app.model.entity.SiteSettingI18n;
import com.katya.app.model.embeddable.SiteSettingI18nId;
import com.katya.app.util.enums.Locale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SiteSettingI18nRepository extends JpaRepository<SiteSettingI18n, SiteSettingI18nId> {

    @Query("SELECT ssi FROM SiteSettingI18n ssi WHERE ssi.siteSetting.key = :settingKey AND ssi.id.locale = :locale")
    Optional<SiteSettingI18n> findBySettingKeyAndLocale(@Param("settingKey") String settingKey,
                                                        @Param("locale") Locale locale);

    @Query("SELECT ssi FROM SiteSettingI18n ssi WHERE ssi.siteSetting.key = :settingKey")
    List<SiteSettingI18n> findBySettingKey(@Param("settingKey") String settingKey);
}