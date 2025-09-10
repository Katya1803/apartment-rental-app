package com.katya.app.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyBatchDuplicateRequest {

    @NotEmpty(message = "New codes list cannot be empty")
    @Size(min = 1, max = 50, message = "Can create between 1 and 50 properties")
    private List<String> newCodes;

    private String codePrefix;
    private Integer startNumber;
    private Integer endNumber;
}