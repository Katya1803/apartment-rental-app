package com.katya.app.util.enums;

public enum FileType {
    IMAGE("image"),
    DOCUMENT("document"),
    OTHER("other");

    private final String code;

    FileType(String code) {
        this.code = code;
    }

    public String getCode() { return code; }

    public static FileType fromMimeType(String mimeType) {
        if (mimeType == null) return OTHER;

        if (mimeType.startsWith("image/")) {
            return IMAGE;
        } else if (mimeType.equals("application/pdf") ||
                mimeType.equals("text/plain") ||
                mimeType.startsWith("application/msword") ||
                mimeType.contains("officedocument")) {
            return DOCUMENT;
        }

        return OTHER;
    }
}