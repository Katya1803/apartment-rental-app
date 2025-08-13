package com.katya.app.repository;

import com.katya.app.model.entity.AmenityI18n;
import com.katya.app.model.embeddable.AmenityI18nId;
import com.katya.app.util.enums.Locale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AmenityI18nRepository extends JpaRepository<AmenityI18n, AmenityI18nId> {

    @Query("SELECT ai FROM AmenityI18n ai WHERE ai.amenity.id = :amenityId AND ai.id.locale = :locale")
    Optional<AmenityI18n> findByAmenityIdAndLocale(@Param("amenityId") Short amenityId,
                                                   @Param("locale") Locale locale);

    @Query("SELECT ai FROM AmenityI18n ai WHERE ai.amenity.id = :amenityId")
    List<AmenityI18n> findByAmenityId(@Param("amenityId") Short amenityId);
}
