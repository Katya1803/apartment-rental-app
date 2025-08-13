package com.katya.app.repository;

import com.katya.app.model.entity.PropertyAmenity;
import com.katya.app.model.embeddable.PropertyAmenityId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyAmenityRepository extends JpaRepository<PropertyAmenity, PropertyAmenityId> {

    @Query("SELECT pa FROM PropertyAmenity pa WHERE pa.property.id = :propertyId")
    List<PropertyAmenity> findByPropertyId(@Param("propertyId") Long propertyId);

    @Query("SELECT pa FROM PropertyAmenity pa WHERE pa.amenity.id = :amenityId")
    List<PropertyAmenity> findByAmenityId(@Param("amenityId") Short amenityId);

    void deleteByPropertyId(Long propertyId);

    void deleteByAmenityId(Short amenityId);
}