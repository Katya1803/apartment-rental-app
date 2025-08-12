package com.katya.app.dto.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorResponse {
    private String error;
    private String message;
    private String path;
    private Integer status;
    private Map<String, String> fieldErrors;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
