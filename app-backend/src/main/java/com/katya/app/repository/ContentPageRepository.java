package com.katya.app.repository;

import com.katya.app.model.entity.ContentPage;
import com.katya.app.util.enums.PropertyStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContentPageRepository extends JpaRepository<ContentPage, Long> {

    Optional<ContentPage> findBySlug(String slug);

    Optional<ContentPage> findBySlugAndStatus(String slug, PropertyStatus status);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    // Published pages for public
    @Query("SELECT cp FROM ContentPage cp WHERE cp.status = 'PUBLISHED' ORDER BY cp.createdAt DESC")
    List<ContentPage> findPublishedPages();

    // Admin - all pages with status filter
    @Query("SELECT cp FROM ContentPage cp WHERE (:status IS NULL OR cp.status = :status) ORDER BY cp.createdAt DESC")
    Page<ContentPage> findPagesForAdmin(@Param("status") PropertyStatus status, Pageable pageable);

    // Count by status
    Long countByStatus(PropertyStatus status);
}
