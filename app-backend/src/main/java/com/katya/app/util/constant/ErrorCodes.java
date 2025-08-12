package com.katya.app.util.constant;

public final class ErrorCodes {

    // General errors
    public static final String INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR";
    public static final String VALIDATION_ERROR = "VALIDATION_ERROR";
    public static final String BAD_REQUEST = "BAD_REQUEST";

    // Authentication errors
    public static final String UNAUTHORIZED = "UNAUTHORIZED";
    public static final String FORBIDDEN = "FORBIDDEN";
    public static final String INVALID_CREDENTIALS = "INVALID_CREDENTIALS";
    public static final String TOKEN_EXPIRED = "TOKEN_EXPIRED";
    public static final String INVALID_TOKEN = "INVALID_TOKEN";

    // Resource errors
    public static final String RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND";
    public static final String RESOURCE_ALREADY_EXISTS = "RESOURCE_ALREADY_EXISTS";
    public static final String RESOURCE_CONFLICT = "RESOURCE_CONFLICT";

    // Property errors
    public static final String PROPERTY_NOT_FOUND = "PROPERTY_NOT_FOUND";
    public static final String PROPERTY_SLUG_EXISTS = "PROPERTY_SLUG_EXISTS";
    public static final String PROPERTY_CANNOT_DELETE = "PROPERTY_CANNOT_DELETE";

    // User errors
    public static final String USER_NOT_FOUND = "USER_NOT_FOUND";
    public static final String USER_EMAIL_EXISTS = "USER_EMAIL_EXISTS";
    public static final String USER_INACTIVE = "USER_INACTIVE";

    // File upload errors
    public static final String FILE_UPLOAD_ERROR = "FILE_UPLOAD_ERROR";
    public static final String FILE_TOO_LARGE = "FILE_TOO_LARGE";
    public static final String FILE_TYPE_NOT_ALLOWED = "FILE_TYPE_NOT_ALLOWED";

    private ErrorCodes() {
        // Prevent instantiation
    }
}