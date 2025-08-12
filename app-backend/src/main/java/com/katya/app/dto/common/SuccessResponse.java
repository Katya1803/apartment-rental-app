package com.katya.app.dto.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuccessResponse {
    private String message;
    private Object data;

    public static SuccessResponse of(String message) {
        return SuccessResponse.builder()
                .message(message)
                .build();
    }

    public static SuccessResponse of(String message, Object data) {
        return SuccessResponse.builder()
                .message(message)
                .data(data)
                .build();
    }
}