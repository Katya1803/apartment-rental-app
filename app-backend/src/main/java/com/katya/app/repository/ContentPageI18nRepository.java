package com.katya.app.repository;

import com.katya.app.model.entity.ContentPageI18n;
import com.katya.app.model.embeddable.ContentPageI18nId;
import com.katya.app.util.enums.Locale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContentPageI18nRepository extends JpaRepository<ContentPageI18n, ContentPageI18nId> {

    @Query("SELECT cpi FROM ContentPageI18n cpi WHERE cpi.contentPage.id = :pageId AND cpi.id.locale = :locale")
    Optional<ContentPageI18n> findByPageIdAndLocale(@Param("pageId") Long pageId,
                                                    @Param("locale") Locale locale);

    @Query("SELECT cpi FROM ContentPageI18n cpi WHERE cpi.contentPage.id = :pageId")
    List<ContentPageI18n> findByPageId(@Param("pageId") Long pageId);
}