package com.katya.app.service.impl;

import com.katya.app.config.CloudinaryConfig;
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
import com.katya.app.service.CloudinaryService;
import com.katya.app.service.FileUploadService;
import com.katya.app.util.constant.BusinessConstants;
import com.katya.app.util.enums.FileType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileUploadServiceImpl implements FileUploadService {

    private final CloudinaryService cloudinaryService;
    private final CloudinaryConfig cloudinaryConfig;
    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final PropertyMapper propertyMapper;

    @Override
    @Transactional
    public FileUploadResponse uploadFile(MultipartFile file, FileType expectedType) {
        validateFile(file, expectedType);

        try {
            String folder = cloudinaryConfig.getFolder() + "/" + expectedType.name().toLowerCase();
            Map<String, Object> result = cloudinaryService.uploadImage(file, folder);

            String publicId = (String) result.get("public_id");
            String secureUrl = (String) result.get("secure_url");
            Integer bytes = (Integer) result.get("bytes");

            log.info("File uploaded successfully to Cloudinary: {}", publicId);

            return FileUploadResponse.builder()
                    .fileName(publicId)
                    .filePath(secureUrl)
                    .fileUrl(secureUrl)
                    .mimeType(file.getContentType())
                    .fileSize(bytes != null ? bytes.longValue() : file.getSize())
                    .fileSizeFormatted(formatFileSize(file.getSize()))
                    .build();

        } catch (Exception e) {
            log.error("Failed to upload file: {}", e.getMessage(), e);
            throw new FileUploadException("Failed to upload file: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public PropertyImageResponse uploadPropertyImage(Long propertyId, MultipartFile file, Short sortOrder, Boolean isCover) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));

        long currentImageCount = propertyImageRepository.countByPropertyId(propertyId);
        if (currentImageCount >= BusinessConstants.MAX_IMAGES_PER_PROPERTY) {
            throw new ValidationException("Cannot add more than " + BusinessConstants.MAX_IMAGES_PER_PROPERTY + " images per property");
        }

        FileUploadResponse uploadResponse = uploadFile(file, FileType.IMAGE);

        if (Boolean.TRUE.equals(isCover)) {
            propertyImageRepository.removeCoverFlagFromProperty(propertyId);
        }

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
    public void deleteFile(String filePathOrUrl) {
        boolean deleted = cloudinaryService.deleteImage(filePathOrUrl);
        if (deleted) {
            log.info("File deleted from Cloudinary: {}", filePathOrUrl);
        } else {
            log.warn("Failed to delete file from Cloudinary: {}", filePathOrUrl);
        }
    }

    @Override
    @Transactional
    public void deletePropertyImage(Long imageId) {
        PropertyImage image = propertyImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("PropertyImage", "id", imageId));

        deleteFile(image.getFilePath());

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

        propertyImageRepository.removeCoverFlagFromProperty(image.getProperty().getId());

        image.setIsCover(true);
        propertyImageRepository.save(image);

        log.info("Cover image set: {}", imageId);
    }

    private void validateFile(MultipartFile file, FileType expectedType) {
        if (file.isEmpty()) {
            throw new FileUploadException("File is empty");
        }

        if (file.getSize() > 10485760L) {
            throw new FileUploadException("File size exceeds maximum allowed size (10MB)");
        }

        String mimeType = file.getContentType();
        if (mimeType == null) {
            throw new FileUploadException("Cannot determine file type");
        }

        if (expectedType == FileType.IMAGE) {
            List<String> allowedTypes = List.of("image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp");
            if (!allowedTypes.contains(mimeType)) {
                throw new FileUploadException("File type not allowed: " + mimeType);
            }
        }
    }

    private String formatFileSize(Long size) {
        if (size == null || size == 0) return "0 B";
        if (size < 1024) return size + " B";
        if (size < 1024 * 1024) return String.format("%.1f KB", size / 1024.0);
        return String.format("%.1f MB", size / (1024.0 * 1024.0));
    }
}