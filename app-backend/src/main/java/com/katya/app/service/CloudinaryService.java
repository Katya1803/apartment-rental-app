package com.katya.app.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface CloudinaryService {
    Map<String, Object> uploadImage(MultipartFile file, String folder);
    boolean deleteImage(String publicId);
}