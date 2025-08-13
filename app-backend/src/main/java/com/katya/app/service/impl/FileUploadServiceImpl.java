package com.katya.app.service.impl;

import com.katya.app.config.FileUploadConfig;
import com.katya.app.dto.mapper.PropertyMapper;
import com.katya.app.dto.response.FileUploadResponse;
import com.katya.app.dto.response.PropertyImageResponse;
import com.katya.app.exception.FileUploadException;
import com.katya.app.exception.ResourceNotFoundException;
import com.katya.app.exception.ValidationException;
import com.katya.app.model.entity.Property;
import com.katya.app.model.entity.PropertyImage;
import com.katya.app.repository.PropertyImageRepository;
import com.katya.app.repository.PropertyRepository;
import com.katya.app.service.FileUploadService;
import com.katya.app.util.constant.BusinessConstants;
import com.katya.app.util.enums.FileType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileUploadServiceImpl implements FileUploadService {

    private final FileUploadConfig fileUploadConfig;
    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final PropertyMapper propertyMapper;

    @Override
    @Transactional
    public FileUploadResponse uploadFile(MultipartFile file, FileType expectedType) {
        validateFile(file, expectedType);

        try {
            String fileName = generateFileName(file.getOriginalFilename());
            String relativePath = getRelativePath(expectedType) + fileName;
            Path filePath = Paths.get(fileUploadConfig.getPath(), relativePath);

            // Create directories if they don't exist
            Files.createDirectories(filePath.getParent());

            // Save file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = fileUploadConfig.getBaseUrl() + relativePath;

            log.info("File uploaded successfully: {}", fileName);

            return FileUploadResponse.builder()
                    .fileName(fileName)
                    .filePath(relativePath)
                    .fileUrl(fileUrl)
                    .mimeType(file.getContentType())
                    .fileSize(file.getSize())
                    .fileSizeFormatted(formatFileSize(file.getSize()))
                    .build();

        } catch (IOException e) {
            log.error("Failed to upload file: {}", e.getMessage(), e);
            throw new FileUploadException("Failed to upload file: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public PropertyImageResponse uploadPropertyImage(Long propertyId, MultipartFile file, Short sortOrder, Boolean isCover) {
        // Validate property exists
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));

        // Check image limit
        long currentImageCount = propertyImageRepository.countByPropertyId(propertyId);
        if (currentImageCount >= BusinessConstants.MAX_IMAGES_PER_PROPERTY) {
            throw new ValidationException("Cannot add more than " + BusinessConstants.MAX_IMAGES_PER_PROPERTY + " images per property");
        }

        // Upload file
        FileUploadResponse uploadResponse = uploadFile(file, FileType.IMAGE);

        // If setting as cover, remove cover flag from other images
        if (Boolean.TRUE.equals(isCover)) {
            propertyImageRepository.removeCoverFlagFromProperty(propertyId);
        }

        // Create property image entity
        PropertyImage propertyImage = PropertyImage.builder()
                .property(property)
                .filePath(uploadResponse.getFilePath())
                .mimeType(uploadResponse.getMimeType())
                .fileSize(uploadResponse.getFileSize().intValue())
                .sortOrder(sortOrder != null ? sortOrder : 0)
                .isCover(Boolean.TRUE.equals(isCover))
                .build();

        propertyImage = propertyImageRepository.save(propertyImage);

        log.info("Property image uploaded successfully for property {}: {}", propertyId, uploadResponse.getFileName());

        return propertyMapper.toImageResponse(propertyImage);
    }

    @Override
    @Transactional
    public void deleteFile(String filePath) {
        try {
            Path path = Paths.get(fileUploadConfig.getPath(), filePath);
            Files.deleteIfExists(path);
            log.info("File deleted: {}", filePath);
        } catch (IOException e) {
            log.warn("Failed to delete file: {}", filePath, e);
        }
    }

    @Override
    @Transactional
    public void deletePropertyImage(Long imageId) {
        PropertyImage image = propertyImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("PropertyImage", "id", imageId));

        // Delete physical file
        deleteFile(image.getFilePath());

        // Delete database record
        propertyImageRepository.delete(image);

        log.info("Property image deleted: {}", imageId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PropertyImageResponse> getPropertyImages(Long propertyId) {
        List<PropertyImage> images = propertyImageRepository.findByPropertyIdOrderBySortOrder(propertyId);
        return images.stream()
                .map(propertyMapper::toImageResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateImageSortOrder(Long imageId, Short sortOrder) {
        if (!propertyImageRepository.existsById(imageId)) {
            throw new ResourceNotFoundException("PropertyImage", "id", imageId);
        }

        propertyImageRepository.updateSortOrder(imageId, sortOrder);
        log.info("Image sort order updated: {} -> {}", imageId, sortOrder);
    }

    @Override
    @Transactional
    public void setCoverImage(Long imageId) {
        PropertyImage image = propertyImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("PropertyImage", "id", imageId));

        // Remove cover flag from all images of this property
        propertyImageRepository.removeCoverFlagFromProperty(image.getProperty().getId());

        // Set this image as cover
        image.setIsCover(true);
        propertyImageRepository.save(image);

        log.info("Cover image set: {}", imageId);
    }

    // Helper methods
    private void validateFile(MultipartFile file, FileType expectedType) {
        if (file.isEmpty()) {
            throw new FileUploadException("File is empty");
        }

        if (file.getSize() > fileUploadConfig.getMaxFileSize()) {
            throw new FileUploadException("File size exceeds maximum allowed size");
        }

        String mimeType = file.getContentType();
        if (mimeType == null) {
            throw new FileUploadException("Cannot determine file type");
        }

        boolean isValidType = false;
        switch (expectedType) {
            case IMAGE:
                isValidType = fileUploadConfig.isValidImageType(mimeType);
                break;
            case DOCUMENT:
                isValidType = fileUploadConfig.isValidDocumentType(mimeType);
                break;
            case OTHER:
                isValidType = true; // Allow any type
                break;
        }

        if (!isValidType) {
            throw new FileUploadException("File type not allowed: " + mimeType);
        }
    }

    private String generateFileName(String originalFileName) {
        String extension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        return UUID.randomUUID().toString() + extension;
    }

    private String getRelativePath(FileType fileType) {
        String typeFolder = switch (fileType) {
            case IMAGE -> "images/";
            case DOCUMENT -> "documents/";
            default -> "others/";
        };

        // Add date-based subfolder for organization
        LocalDateTime now = LocalDateTime.now();
        return typeFolder + now.getYear() + "/" + String.format("%02d", now.getMonthValue()) + "/";
    }

    private String formatFileSize(Long size) {
        if (size == null || size == 0) return "0 B";
        if (size < 1024) return size + " B";
        if (size < 1024 * 1024) return String.format("%.1f KB", size / 1024.0);
        return String.format("%.1f MB", size / (1024.0 * 1024.0));
    }
}