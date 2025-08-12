package com.katya.app.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {

    // Property statistics
    private Long totalProperties;
    private Long publishedProperties;
    private Long draftProperties;
    private Long featuredProperties;
    private Long totalByType;

    // Property type breakdown
    private Long totalApartments;
    private Long totalRooms;
    private Long totalStudios;
    private Long totalHouses;

    // Contact statistics
    private Long totalContactMessages;
    private Long unhandledMessages;
    private Long handledMessages;
    private Long messagesThisMonth;

    // Price statistics
    private BigDecimal averagePrice;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;

    // User statistics
    private Long totalUsers;
    private Long activeUsers;

    // Recent activity counts
    private Long propertiesCreatedThisWeek;
    private Long messagesReceivedThisWeek;
}
