package com.katya.app.repository;

import com.katya.app.model.entity.PropertyI18n;
import com.katya.app.model.embeddable.PropertyI18nId;
import com.katya.app.util.enums.Locale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PropertyI18nRepository extends JpaRepository<PropertyI18n, PropertyI18nId> {

    // Get translation for property and locale
    @Query("SELECT pi FROM PropertyI18n pi WHERE pi.property.id = :propertyId AND pi.id.locale = :locale")
    Optional<PropertyI18n> findByPropertyIdAndLocale(@Param("propertyId") Long propertyId,
                                                     @Param("locale") Locale locale);

    // Get all translations for property
    @Query("SELECT pi FROM PropertyI18n pi WHERE pi.property.id = :propertyId")
    List<PropertyI18n> findByPropertyId(@Param("propertyId") Long propertyId);

    // Delete by property (for cascade operations)
    void deleteByPropertyId(Long propertyId);
}
