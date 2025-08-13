package com.katya.app.controller.page;

import com.katya.app.dto.common.ApiResponse;
import com.katya.app.dto.request.ContactMessageRequest;
import com.katya.app.service.ContactMessageService;
import com.katya.app.util.ResponseBuilder;
import com.katya.app.util.constant.ApiEndpoints;
import com.katya.app.util.constant.AppConstants;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiEndpoints.CONTACT)
@RequiredArgsConstructor
public class ContactController {

    private final ContactMessageService contactMessageService;

    @PostMapping
    public ResponseEntity<ApiResponse<String>> submitContactMessage(@Valid @RequestBody ContactMessageRequest request) {
        contactMessageService.submitContactMessage(request);
        return ResponseBuilder.success(AppConstants.SUCCESS_CREATED, "Contact message submitted successfully");
    }
}