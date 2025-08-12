package com.katya.app.util.constant;

public final class RegexPatterns {

    // Slug pattern (lowercase, numbers, hyphens)
    public static final String SLUG = "^[a-z0-9-]+$";

    // Email pattern
    public static final String EMAIL = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";

    // Phone pattern (Vietnamese)
    public static final String PHONE_VN = "^(\\+84|0)[1-9][0-9]{8,9}$";

    // Password pattern (min 6 chars, at least 1 upper, 1 lower, 1 digit)
    public static final String PASSWORD = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{6,50}$";

    // Coordinate patterns
    public static final String LATITUDE = "^[-]?([0-8]?[0-9]|90)(\\.\\d{1,10})?$";
    public static final String LONGITUDE = "^[-]?((1[0-7][0-9])|([0-9]?[0-9]))(\\.\\d{1,10})?$";

    private RegexPatterns() {
        // Prevent instantiation
    }
}