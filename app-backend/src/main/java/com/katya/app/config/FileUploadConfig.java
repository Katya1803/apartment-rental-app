package com.katya.app.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Data
@Configuration
@ConfigurationProperties(prefix = "app.upload")
public class FileUploadConfig {

    // Cloudinary settings
    private String provider = "cloudinary"; // "local" hoặc "cloudinary"
    private String cloudinaryFolder = "qapartment"; // Folder trên Cloudinary

    // Legacy local settings (backup)
    private String path = "/tmp/uploads/";
    private String baseUrl = "/uploads/";

    // File validation
    private long maxFileSize = 10485760L; // 10MB
    private long maxRequestSize = 52428800L; // 50MB

    private List<String> allowedImageTypes = List.of(
            "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    );

    private List<String> allowedDocumentTypes = List.of(
            "application/pdf", "text/plain", "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    public boolean isValidImageType(String mimeType) {
        return allowedImageTypes.contains(mimeType);
    }

    public boolean isValidDocumentType(String mimeType) {
        return allowedDocumentTypes.contains(mimeType);
    }

    public boolean isCloudinaryEnabled() {
        return "cloudinary".equals(provider);
    }
}