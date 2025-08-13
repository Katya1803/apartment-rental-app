package com.katya.app.repository;

import com.katya.app.model.entity.SiteSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SiteSettingRepository extends JpaRepository<SiteSetting, String> {

    Optional<SiteSetting> findByKey(String key);

    boolean existsByKey(String key);

    // All settings ordered by key
    @Query("SELECT ss FROM SiteSetting ss ORDER BY ss.key")
    List<SiteSetting> findAllOrdered();

    // Company info settings (common ones)
    @Query("SELECT ss FROM SiteSetting ss WHERE ss.key IN ('company_name', 'company_phone', 'company_email', 'company_address', 'company_zalo') ORDER BY ss.key")
    List<SiteSetting> findCompanyInfoSettings();
}