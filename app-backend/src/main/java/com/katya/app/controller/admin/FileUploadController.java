package com.katya.app.controller.admin;

import com.katya.app.dto.common.ApiResponse;
import com.katya.app.dto.response.FileUploadResponse;
import com.katya.app.service.FileUploadService;
import com.katya.app.util.ResponseBuilder;
import com.katya.app.util.enums.FileType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/files")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'EDITOR')")
public class FileUploadController {

    private final FileUploadService fileUploadService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<FileUploadResponse>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false, defaultValue = "OTHER") FileType fileType) {

        FileUploadResponse response = fileUploadService.uploadFile(file, fileType);
        return ResponseBuilder.created(response, "File uploaded successfully");
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<String>> deleteFile(@RequestParam String filePath) {
        fileUploadService.deleteFile(filePath);
        return ResponseBuilder.success("File deleted successfully");
    }
}
