package com.katya.app.repository;

import com.katya.app.model.entity.PropertyImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PropertyImageRepository extends JpaRepository<PropertyImage, Long> {

    // Images for a property
    @Query("SELECT pi FROM PropertyImage pi WHERE pi.property.id = :propertyId ORDER BY pi.sortOrder ASC")
    List<PropertyImage> findByPropertyIdOrderBySortOrder(@Param("propertyId") Long propertyId);

    // Cover image for property
    @Query("SELECT pi FROM PropertyImage pi WHERE pi.property.id = :propertyId AND pi.isCover = true")
    Optional<PropertyImage> findCoverImageByPropertyId(@Param("propertyId") Long propertyId);

    // Count images for property
    Long countByPropertyId(Long propertyId);

    // Remove cover flag from all images of a property
    @Modifying
    @Query("UPDATE PropertyImage pi SET pi.isCover = false WHERE pi.property.id = :propertyId")
    void removeCoverFlagFromProperty(@Param("propertyId") Long propertyId);

    // Update sort order
    @Modifying
    @Query("UPDATE PropertyImage pi SET pi.sortOrder = :sortOrder WHERE pi.id = :imageId")
    void updateSortOrder(@Param("imageId") Long imageId, @Param("sortOrder") Short sortOrder);

    // Delete by property (for cascade operations)
    void deleteByPropertyId(Long propertyId);
}