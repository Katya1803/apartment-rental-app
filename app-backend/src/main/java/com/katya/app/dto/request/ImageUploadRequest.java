package com.katya.app.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageUploadRequest {

    @Min(value = 0, message = "Sort order cannot be negative")
    @Max(value = 100, message = "Sort order cannot exceed 100")
    @Builder.Default
    private Short sortOrder = 0;

    @Builder.Default
    private Boolean isCover = false;
}