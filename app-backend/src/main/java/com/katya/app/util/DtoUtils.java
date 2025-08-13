package com.katya.app.util;

import com.katya.app.util.enums.Locale;
import com.katya.app.util.enums.PropertyType;
import com.katya.app.util.enums.PropertyStatus;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class DtoUtils {

    public static Locale parseLocale(String localeCode, Locale defaultLocale) {
        if (localeCode == null || localeCode.trim().isEmpty()) {
            return defaultLocale;
        }

        try {
            String normalizedCode = localeCode.toLowerCase().trim();

            // Direct mapping thay vì dùng enum parsing
            switch (normalizedCode) {
                case "vi":
                    return Locale.VI;
                case "en":
                    return Locale.EN;
                case "ja":
                    return Locale.JA;
                default:
                    return defaultLocale; // Fallback thay vì throw exception
            }
        } catch (Exception e) {
            return defaultLocale;
        }
    }

    public static PropertyType parsePropertyType(String typeCode) {
        if (typeCode == null || typeCode.trim().isEmpty()) {
            return null;
        }

        try {
            return PropertyType.fromCode(typeCode.toLowerCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    public static PropertyStatus parsePropertyStatus(String statusCode) {
        if (statusCode == null || statusCode.trim().isEmpty()) {
            return null;
        }

        try {
            return PropertyStatus.valueOf(statusCode.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    public static Pageable createPageable(Integer page, Integer size, String sortBy, String sortDirection) {
        // Default values
        if (page == null || page < 0) page = 0;
        if (size == null || size < 1) size = 20;
        if (size > 100) size = 100; // Max page size
        if (sortBy == null || sortBy.trim().isEmpty()) sortBy = "createdAt";

        Sort.Direction direction = Sort.Direction.DESC;
        if ("asc".equalsIgnoreCase(sortDirection)) {
            direction = Sort.Direction.ASC;
        }

        Sort sort = Sort.by(direction, sortBy);
        return PageRequest.of(page, size, sort);
    }

    public static String sanitizeSlug(String slug) {
        if (slug == null) return null;

        return slug.toLowerCase()
                .replaceAll("[^a-z0-9-]", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }

    public static String formatCurrency(java.math.BigDecimal amount) {
        if (amount == null) return "0";

        java.text.NumberFormat formatter = java.text.NumberFormat.getCurrencyInstance(java.util.Locale.forLanguageTag("vi-VN"));
        return formatter.format(amount);
    }

    public static String formatArea(java.math.BigDecimal area) {
        if (area == null) return "N/A";

        return String.format("%.1f m²", area);
    }

    public static boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) return false;

        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        return email.matches(emailRegex);
    }
}