package com.katya.app.repository;

import com.katya.app.model.entity.Property;
import com.katya.app.util.enums.PropertyStatus;
import com.katya.app.util.enums.PropertyType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    // Basic finders
    Optional<Property> findBySlugAndStatus(String slug, PropertyStatus status);

    Optional<Property> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    // Published properties for public
    @Query("SELECT p FROM Property p WHERE p.status = 'PUBLISHED' ORDER BY p.isFeatured DESC, p.publishedAt DESC")
    Page<Property> findPublishedProperties(Pageable pageable);

    // By property type
    @Query("SELECT p FROM Property p WHERE p.status = 'PUBLISHED' AND p.propertyType = :type ORDER BY p.isFeatured DESC, p.publishedAt DESC")
    Page<Property> findPublishedPropertiesByType(@Param("type") PropertyType type, Pageable pageable);

    // Featured properties
    @Query("SELECT p FROM Property p WHERE p.status = 'PUBLISHED' AND p.isFeatured = true ORDER BY p.publishedAt DESC")
    List<Property> findFeaturedProperties();

    // Admin - all properties with filtering
    @Query("SELECT p FROM Property p WHERE (:status IS NULL OR p.status = :status) " +
            "AND (:type IS NULL OR p.propertyType = :type) " +
            "ORDER BY p.createdAt DESC")
    Page<Property> findPropertiesForAdmin(@Param("status") PropertyStatus status,
                                          @Param("type") PropertyType type,
                                          Pageable pageable);

    // Search properties (simple text search)
    @Query("SELECT DISTINCT p FROM Property p " +
            "LEFT JOIN p.translations t " +
            "WHERE p.status = 'PUBLISHED' " +
            "AND (LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(t.addressText) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(p.code) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "ORDER BY p.isFeatured DESC, p.publishedAt DESC")
    Page<Property> searchPublishedProperties(@Param("query") String query, Pageable pageable);

    // Price range filter
    @Query("SELECT p FROM Property p WHERE p.status = 'PUBLISHED' " +
            "AND (:minPrice IS NULL OR p.priceMonth >= :minPrice) " +
            "AND (:maxPrice IS NULL OR p.priceMonth <= :maxPrice) " +
            "ORDER BY p.isFeatured DESC, p.publishedAt DESC")
    Page<Property> findPropertiesByPriceRange(@Param("minPrice") BigDecimal minPrice,
                                              @Param("maxPrice") BigDecimal maxPrice,
                                              Pageable pageable);

    // Complex search with multiple filters
    @Query("SELECT DISTINCT p FROM Property p " +
            "LEFT JOIN p.translations t " +
            "LEFT JOIN p.amenities pa " +
            "WHERE p.status = 'PUBLISHED' " +
            "AND (:query IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(t.addressText) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "AND (:type IS NULL OR p.propertyType = :type) " +
            "AND (:minPrice IS NULL OR p.priceMonth >= :minPrice) " +
            "AND (:maxPrice IS NULL OR p.priceMonth <= :maxPrice) " +
            "AND (:minArea IS NULL OR p.areaSqm >= :minArea) " +
            "AND (:maxArea IS NULL OR p.areaSqm <= :maxArea) " +
            "AND (:minBedrooms IS NULL OR p.bedrooms >= :minBedrooms) " +
            "AND (:maxBedrooms IS NULL OR p.bedrooms <= :maxBedrooms) " +
            "AND (:isFeatured IS NULL OR p.isFeatured = :isFeatured) " +
            "ORDER BY p.isFeatured DESC, p.publishedAt DESC")
    Page<Property> searchPropertiesWithFilters(@Param("query") String query,
                                               @Param("type") PropertyType type,
                                               @Param("minPrice") BigDecimal minPrice,
                                               @Param("maxPrice") BigDecimal maxPrice,
                                               @Param("minArea") BigDecimal minArea,
                                               @Param("maxArea") BigDecimal maxArea,
                                               @Param("minBedrooms") Short minBedrooms,
                                               @Param("maxBedrooms") Short maxBedrooms,
                                               @Param("isFeatured") Boolean isFeatured,
                                               Pageable pageable);

    // Statistics for admin dashboard
    Long countByStatus(PropertyStatus status);

    Long countByPropertyType(PropertyType type);

    Long countByIsFeaturedTrue();

    @Query("SELECT COUNT(p) FROM Property p WHERE p.createdAt >= :startDate")
    Long countPropertiesCreatedAfter(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT AVG(p.priceMonth) FROM Property p WHERE p.status = 'PUBLISHED'")
    BigDecimal getAveragePrice();

    @Query("SELECT MIN(p.priceMonth) FROM Property p WHERE p.status = 'PUBLISHED'")
    BigDecimal getMinPrice();

    @Query("SELECT MAX(p.priceMonth) FROM Property p WHERE p.status = 'PUBLISHED'")
    BigDecimal getMaxPrice();
}