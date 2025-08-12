package com.katya.app.util.constant;

import java.math.BigDecimal;

public final class BusinessConstants {

    // Property constraints
    public static final BigDecimal MIN_PROPERTY_AREA = BigDecimal.valueOf(10); // 10 sqm
    public static final BigDecimal MAX_PROPERTY_AREA = BigDecimal.valueOf(1000); // 1000 sqm

    public static final int MIN_BEDROOMS = 0;
    public static final int MAX_BEDROOMS = 20;
    public static final int MIN_BATHROOMS = 0;
    public static final int MAX_BATHROOMS = 20;

    // Image constraints
    public static final int MAX_IMAGES_PER_PROPERTY = 20;
    public static final int MAX_IMAGE_WIDTH = 2048;
    public static final int MAX_IMAGE_HEIGHT = 2048;

    // Contact message constraints
    public static final int MAX_MESSAGE_LENGTH = 2000;
    public static final int MAX_SUBJECT_LENGTH = 200;

    // User constraints
    public static final int MAX_USERNAME_LENGTH = 50;
    public static final int MAX_FULLNAME_LENGTH = 100;

    // Search constraints
    public static final int MAX_SEARCH_RESULTS = 1000;
    public static final int SEARCH_MIN_QUERY_LENGTH = 2;

    // Currency
    public static final String DEFAULT_CURRENCY = "USD";
    public static final String CURRENCY_SYMBOL = "$";

    private BusinessConstants() {
    }
}