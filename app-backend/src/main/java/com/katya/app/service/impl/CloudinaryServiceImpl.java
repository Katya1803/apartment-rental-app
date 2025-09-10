package com.katya.app.service.impl;

import com.cloudinary.Cloudinary;
import com.katya.app.exception.FileUploadException;
import com.katya.app.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;

    @Override
    public Map<String, Object> uploadImage(MultipartFile file, String folder) {
        try {
            Map<String, Object> uploadParams = new HashMap<>();
            uploadParams.put("folder", folder);
            uploadParams.put("resource_type", "image");

            Map<String, Object> result = cloudinary.uploader().upload(file.getBytes(), uploadParams);

            log.info("Image uploaded to Cloudinary successfully. Public ID: {}", result.get("public_id"));

            return result;

        } catch (IOException e) {
            log.error("Failed to upload image to Cloudinary: {}", e.getMessage(), e);
            throw new FileUploadException("Failed to upload image: " + e.getMessage());
        }
    }

    @Override
    public boolean deleteImage(String publicIdOrUrl) {
        try {
            String publicId = extractPublicId(publicIdOrUrl);

            Map<String, Object> result = cloudinary.uploader().destroy(publicId, new HashMap<>());

            String resultStatus = (String) result.get("result");
            boolean success = "ok".equals(resultStatus);

            if (success) {
                log.info("Image deleted from Cloudinary successfully. Public ID: {}", publicId);
            } else {
                log.warn("Failed to delete image from Cloudinary. Public ID: {}, Result: {}", publicId, resultStatus);
            }

            return success;

        } catch (IOException e) {
            log.error("Failed to delete image from Cloudinary: {}", e.getMessage(), e);
            return false;
        }
    }

    private String extractPublicId(String publicIdOrUrl) {
        if (publicIdOrUrl.startsWith("http")) {
            String[] parts = publicIdOrUrl.split("/upload/");
            if (parts.length > 1) {
                String afterUpload = parts[1];
                int lastDot = afterUpload.lastIndexOf('.');
                return lastDot > 0 ? afterUpload.substring(0, lastDot) : afterUpload;
            }
        }
        return publicIdOrUrl;
    }
}
