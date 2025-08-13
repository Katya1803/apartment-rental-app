package com.katya.app.service;

import com.katya.app.dto.response.FileUploadResponse;
import com.katya.app.dto.response.PropertyImageResponse;
import com.katya.app.util.enums.FileType;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FileUploadService {

    FileUploadResponse uploadFile(MultipartFile file, FileType expectedType);

    PropertyImageResponse uploadPropertyImage(Long propertyId, MultipartFile file, Short sortOrder, Boolean isCover);

    void deleteFile(String filePath);

    void deletePropertyImage(Long imageId);

    List<PropertyImageResponse> getPropertyImages(Long propertyId);

    void updateImageSortOrder(Long imageId, Short sortOrder);

    void setCoverImage(Long imageId);
}