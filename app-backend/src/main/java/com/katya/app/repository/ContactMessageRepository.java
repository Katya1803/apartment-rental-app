package com.katya.app.repository;

import com.katya.app.model.entity.ContactMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    // Admin - all messages
    @Query("SELECT cm FROM ContactMessage cm ORDER BY cm.createdAt DESC")
    Page<ContactMessage> findAllOrderByCreatedAtDesc(Pageable pageable);

    // Unhandled messages
    @Query("SELECT cm FROM ContactMessage cm WHERE cm.handledAt IS NULL ORDER BY cm.createdAt DESC")
    Page<ContactMessage> findUnhandledMessages(Pageable pageable);

    // Handled messages
    @Query("SELECT cm FROM ContactMessage cm WHERE cm.handledAt IS NOT NULL ORDER BY cm.handledAt DESC")
    Page<ContactMessage> findHandledMessages(Pageable pageable);

    // Messages for specific property
    @Query("SELECT cm FROM ContactMessage cm WHERE cm.property.id = :propertyId ORDER BY cm.createdAt DESC")
    List<ContactMessage> findByPropertyId(@Param("propertyId") Long propertyId);

    // Statistics
    Long countByHandledAtIsNull();

    Long countByHandledAtIsNotNull();

    @Query("SELECT COUNT(cm) FROM ContactMessage cm WHERE cm.createdAt >= :startDate")
    Long countMessagesCreatedAfter(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT COUNT(cm) FROM ContactMessage cm WHERE cm.createdAt >= :startDate AND cm.createdAt <= :endDate")
    Long countMessagesBetween(@Param("startDate") LocalDateTime startDate,
                              @Param("endDate") LocalDateTime endDate);

    // Search messages
    @Query("SELECT cm FROM ContactMessage cm WHERE " +
            "LOWER(cm.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(cm.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(cm.subject) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "ORDER BY cm.createdAt DESC")
    Page<ContactMessage> searchMessages(@Param("query") String query, Pageable pageable);
}
