package com.katya.app.service.impl;

import com.katya.app.dto.response.DashboardStatsResponse;
import com.katya.app.repository.AppUserRepository;
import com.katya.app.repository.ContactMessageRepository;
import com.katya.app.repository.PropertyRepository;
import com.katya.app.service.AnalyticsService;
import com.katya.app.util.enums.PropertyStatus;
import com.katya.app.util.enums.PropertyType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final PropertyRepository propertyRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final AppUserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        LocalDateTime oneMonthAgo = LocalDateTime.now().minusMonths(1);

        return DashboardStatsResponse.builder()
                // Property statistics
                .totalProperties(propertyRepository.count())
                .publishedProperties(propertyRepository.countByStatus(PropertyStatus.PUBLISHED))
                .draftProperties(propertyRepository.countByStatus(PropertyStatus.DRAFT))
                .featuredProperties(propertyRepository.countByIsFeaturedTrue())

                // Property type breakdown
                .totalApartments(propertyRepository.countByPropertyType(PropertyType.APARTMENT))
                .totalRooms(propertyRepository.countByPropertyType(PropertyType.ROOM))
                .totalStudios(propertyRepository.countByPropertyType(PropertyType.STUDIO))
                .totalHouses(propertyRepository.countByPropertyType(PropertyType.HOUSE))

                // Contact statistics
                .totalContactMessages(contactMessageRepository.count())
                .unhandledMessages(contactMessageRepository.countByHandledAtIsNull())
                .handledMessages(contactMessageRepository.countByHandledAtIsNotNull())
                .messagesThisMonth(contactMessageRepository.countMessagesCreatedAfter(oneMonthAgo))

                // Price statistics
                .averagePrice(propertyRepository.getAveragePrice())
                .minPrice(propertyRepository.getMinPrice())
                .maxPrice(propertyRepository.getMaxPrice())

                // User statistics
                .totalUsers(userRepository.count())
                .activeUsers(userRepository.countActiveUsers())

                // Recent activity
                .propertiesCreatedThisWeek(propertyRepository.countPropertiesCreatedAfter(oneWeekAgo))
                .messagesReceivedThisWeek(contactMessageRepository.countMessagesCreatedAfter(oneWeekAgo))

                .build();
    }
}