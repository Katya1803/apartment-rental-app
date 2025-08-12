package com.katya.app.util.constant;

public final class ValidationMessages {

    // Common
    public static final String REQUIRED = "This field is required";
    public static final String INVALID_FORMAT = "Invalid format";
    public static final String TOO_LONG = "Value is too long";
    public static final String TOO_SHORT = "Value is too short";

    // Email
    public static final String INVALID_EMAIL = "Invalid email format";
    public static final String EMAIL_REQUIRED = "Email is required";

    // Password
    public static final String PASSWORD_REQUIRED = "Password is required";
    public static final String PASSWORD_TOO_SHORT = "Password must be at least 6 characters";
    public static final String PASSWORD_TOO_LONG = "Password cannot exceed 50 characters";
    public static final String PASSWORD_WEAK = "Password must contain uppercase, lowercase, and digit";

    // Property
    public static final String PROPERTY_TITLE_REQUIRED = "Property title is required";
    public static final String PROPERTY_PRICE_REQUIRED = "Property price is required";
    public static final String PROPERTY_PRICE_INVALID = "Property price must be greater than 0";
    public static final String PROPERTY_SLUG_INVALID = "Slug must contain only lowercase letters, numbers, and hyphens";

    // File upload
    public static final String FILE_TOO_LARGE = "File size exceeds maximum allowed size";
    public static final String FILE_TYPE_NOT_ALLOWED = "File type is not allowed";

    // Coordinates
    public static final String INVALID_LATITUDE = "Latitude must be between -90 and 90";
    public static final String INVALID_LONGITUDE = "Longitude must be between -180 and 180";

    private ValidationMessages() {
        // Prevent instantiation
    }
}