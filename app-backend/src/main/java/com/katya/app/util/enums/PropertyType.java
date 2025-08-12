package com.katya.app.util.enums;

public enum PropertyType {
    APARTMENT("apartment"),   // Căn hộ
    ROOM("room"),            // Phòng trọ
    STUDIO("studio"),        // Studio
    HOUSE("house");          // Nhà nguyên căn

    private final String code;

    PropertyType(String code) {
        this.code = code;
    }

    public String getCode() { return code; }

    public static PropertyType fromCode(String code) {
        for (PropertyType type : values()) {
            if (type.code.equals(code)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown property type code: " + code);
    }
}