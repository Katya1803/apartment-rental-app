package com.katya.app.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyImageResponse {
    private Long id;
    private String filePath;
    private String imageUrl;
    private String mimeType;
    private Integer fileSize;
    private String fileSizeFormatted;
    private Short sortOrder;
    private Boolean isCover;
}