package com.katya.app.util.constant;

public final class AppConstants {

    // Pagination
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 100;
    public static final String DEFAULT_SORT_BY = "createdAt";
    public static final String DEFAULT_SORT_DIRECTION = "desc";

    // Default locale
    public static final String DEFAULT_LOCALE = "vi";

    // File upload
    public static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    public static final String[] ALLOWED_IMAGE_EXTENSIONS = {"jpg", "jpeg", "png", "gif", "webp"};
    public static final String[] ALLOWED_DOCUMENT_EXTENSIONS = {"pdf", "doc", "docx", "txt"};

    // Cache names
    public static final String CACHE_PROPERTIES = "properties";
    public static final String CACHE_AMENITIES = "amenities";
    public static final String CACHE_SITE_SETTINGS = "siteSettings";

    // Error messages
    public static final String ERROR_RESOURCE_NOT_FOUND = "Resource not found";
    public static final String ERROR_DUPLICATE_RESOURCE = "Resource already exists";
    public static final String ERROR_VALIDATION_FAILED = "Validation failed";
    public static final String ERROR_UNAUTHORIZED = "Unauthorized access";
    public static final String ERROR_FORBIDDEN = "Access denied";

    // Success messages
    public static final String SUCCESS_CREATED = "Resource created successfully";
    public static final String SUCCESS_UPDATED = "Resource updated successfully";
    public static final String SUCCESS_DELETED = "Resource deleted successfully";

    // JWT
    public static final String JWT_TOKEN_PREFIX = "Bearer ";
    public static final String JWT_HEADER_STRING = "Authorization";

    private AppConstants() {
        // Prevent instantiation
    }
}