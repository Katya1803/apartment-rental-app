package com.katya.app.dto.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IdResponse {
    private Long id;
    private String message;

    public static IdResponse of(Long id) {
        return IdResponse.builder().id(id).build();
    }

    public static IdResponse of(Long id, String message) {
        return IdResponse.builder()
                .id(id)
                .message(message)
                .build();
    }
}