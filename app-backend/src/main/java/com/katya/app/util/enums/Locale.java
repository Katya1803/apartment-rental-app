package com.katya.app.util.enums;

public enum Locale {
    VI("vi"), EN("en"), JA("ja");

    private final String code;

    Locale(String code) {
        this.code = code;
    }

    public String getCode() { return code; }

    public static Locale fromCode(String code) {
        for (Locale locale : values()) {
            if (locale.code.equals(code)) {
                return locale;
            }
        }
        throw new IllegalArgumentException("Unknown locale code: " + code);
    }
}