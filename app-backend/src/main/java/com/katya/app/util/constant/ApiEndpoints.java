package com.katya.app.util.constant;

public final class ApiEndpoints {

    // Base paths
    public static final String API_BASE = "/api";
    public static final String ADMIN_BASE = "/api/admin";

    // Public endpoints
    public static final String PROPERTIES = API_BASE + "/properties";
    public static final String AMENITIES = API_BASE + "/amenities";
    public static final String DISTRICTS = API_BASE + "/districts";
    public static final String CONTACT = API_BASE + "/contact";
    public static final String CONTENT = API_BASE + "/content";
    public static final String COMPANY_INFO = API_BASE + "/company-info";

    // Auth endpoints
    public static final String AUTH = API_BASE + "/auth";
    public static final String AUTH_LOGIN = AUTH + "/login";
    public static final String AUTH_LOGOUT = AUTH + "/logout";
    public static final String AUTH_REFRESH = AUTH + "/refresh";
    public static final String AUTH_CHANGE_PASSWORD = AUTH + "/change-password";

    // Admin endpoints
    public static final String ADMIN_PROPERTIES = ADMIN_BASE + "/properties";
    public static final String ADMIN_USERS = ADMIN_BASE + "/users";
    public static final String ADMIN_MESSAGES = ADMIN_BASE + "/messages";
    public static final String ADMIN_ANALYTICS = ADMIN_BASE + "/analytics";
    public static final String ADMIN_SITE_SETTINGS = ADMIN_BASE + "/site-settings";
    public static final String ADMIN_CONTENT = ADMIN_BASE + "/content";

    private ApiEndpoints() {
        // Prevent instantiation
    }
}