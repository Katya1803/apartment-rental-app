package com.katya.app.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileUploadResponse {
    private String fileName;
    private String filePath;
    private String fileUrl;
    private String mimeType;
    private Long fileSize;
    private String fileSizeFormatted;
}
