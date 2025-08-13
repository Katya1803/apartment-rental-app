package com.katya.app.controller.admin;

import com.katya.app.dto.common.ApiResponse;
import com.katya.app.dto.common.PageResponse;
import com.katya.app.dto.response.ContactMessageResponse;
import com.katya.app.security.UserPrincipal;
import com.katya.app.service.ContactMessageService;
import com.katya.app.util.DtoUtils;
import com.katya.app.util.ResponseBuilder;
import com.katya.app.util.constant.ApiEndpoints;
import com.katya.app.util.constant.AppConstants;
import com.katya.app.util.enums.Locale;
import com.katya.app.util.validation.ValidLocale;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiEndpoints.ADMIN_MESSAGES)
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminMessageController {

    private final ContactMessageService contactMessageService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ContactMessageResponse>>> getAllMessages(
            @RequestParam(required = false, defaultValue = AppConstants.DEFAULT_LOCALE) @ValidLocale String locale,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size) {

        Locale loc = DtoUtils.parseLocale(locale, Locale.VI);
        Page<ContactMessageResponse> messages = contactMessageService.getAllMessages(loc, page, size);
        return ResponseBuilder.page(messages);
    }

    @GetMapping("/unhandled")
    public ResponseEntity<ApiResponse<PageResponse<ContactMessageResponse>>> getUnhandledMessages(
            @RequestParam(required = false, defaultValue = AppConstants.DEFAULT_LOCALE) @ValidLocale String locale,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size) {

        Locale loc = DtoUtils.parseLocale(locale, Locale.VI);
        Page<ContactMessageResponse> messages = contactMessageService.getUnhandledMessages(loc, page, size);
        return ResponseBuilder.page(messages);
    }

    @GetMapping("/handled")
    public ResponseEntity<ApiResponse<PageResponse<ContactMessageResponse>>> getHandledMessages(
            @RequestParam(required = false, defaultValue = AppConstants.DEFAULT_LOCALE) @ValidLocale String locale,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size) {

        Locale loc = DtoUtils.parseLocale(locale, Locale.VI);
        Page<ContactMessageResponse> messages = contactMessageService.getHandledMessages(loc, page, size);
        return ResponseBuilder.page(messages);
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<ContactMessageResponse>>> searchMessages(
            @RequestParam String query,
            @RequestParam(required = false, defaultValue = AppConstants.DEFAULT_LOCALE) @ValidLocale String locale,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size) {

        Locale loc = DtoUtils.parseLocale(locale, Locale.VI);
        Page<ContactMessageResponse> messages = contactMessageService.searchMessages(query, loc, page, size);
        return ResponseBuilder.page(messages);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ContactMessageResponse>> getMessageById(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = AppConstants.DEFAULT_LOCALE) @ValidLocale String locale) {

        Locale loc = DtoUtils.parseLocale(locale, Locale.VI);
        ContactMessageResponse message = contactMessageService.getMessageById(id, loc);
        return ResponseBuilder.success(message);
    }

    @PatchMapping("/{id}/handle")
    public ResponseEntity<ApiResponse<String>> markMessageAsHandled(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        contactMessageService.markMessageAsHandled(id, userPrincipal.getId());
        return ResponseBuilder.success("Message marked as handled successfully");
    }
}
