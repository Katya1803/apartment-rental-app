package com.katya.app.repository;

import com.katya.app.model.entity.Amenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AmenityRepository extends JpaRepository<Amenity, Short> {

    Optional<Amenity> findByKey(String key);

    boolean existsByKey(String key);

    boolean existsByKeyAndIdNot(String key, Short id);

    // Room-specific amenities
    @Query("SELECT a FROM Amenity a WHERE a.key LIKE 'shared_%' OR a.key LIKE 'private_%' OR a.key IN ('laundry_service', 'cleaning_service') ORDER BY a.key")
    List<Amenity> findRoomAmenities();

    // Common amenities for apartments/houses
    @Query("SELECT a FROM Amenity a WHERE NOT (a.key LIKE 'shared_%' OR a.key LIKE 'private_%' OR a.key IN ('laundry_service', 'cleaning_service')) ORDER BY a.key")
    List<Amenity> findCommonAmenities();

    // All amenities ordered by key
    @Query("SELECT a FROM Amenity a ORDER BY a.key")
    List<Amenity> findAllOrdered();
}
