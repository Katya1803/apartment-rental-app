package com.katya.app.repository;

import com.katya.app.model.entity.AppUser;
import com.katya.app.util.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByEmail(String email);

    Optional<AppUser> findByEmailAndIsActiveTrue(String email);

    Optional<AppUser> findByIdAndIsActiveTrue(Long id);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    @Query("SELECT u FROM AppUser u WHERE u.isActive = true")
    Page<AppUser> findAllActiveUsers(Pageable pageable);

    @Query("SELECT u FROM AppUser u WHERE u.role = :role AND u.isActive = true")
    Page<AppUser> findByRoleAndIsActiveTrue(@Param("role") UserRole role, Pageable pageable);

    @Query("SELECT COUNT(u) FROM AppUser u WHERE u.isActive = true")
    Long countActiveUsers();

    @Query("SELECT COUNT(u) FROM AppUser u WHERE u.role = :role AND u.isActive = true")
    Long countByRoleAndIsActiveTrue(@Param("role") UserRole role);

    @Query("SELECT u FROM AppUser u WHERE u.fullName ILIKE %:query% OR u.email ILIKE %:query%")
    Page<AppUser> searchUsers(@Param("query") String query, Pageable pageable);

    @Query("SELECT u FROM AppUser u WHERE u.createdAt >= :startDate")
    Page<AppUser> findUsersCreatedAfter(@Param("startDate") LocalDateTime startDate, Pageable pageable);
}