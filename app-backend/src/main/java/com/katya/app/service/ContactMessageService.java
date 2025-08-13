package com.katya.app.service;

import com.katya.app.dto.request.ContactMessageRequest;
import com.katya.app.dto.response.ContactMessageResponse;
import com.katya.app.util.enums.Locale;
import org.springframework.data.domain.Page;

public interface ContactMessageService {

    // Public API
    void submitContactMessage(ContactMessageRequest request);

    // Admin APIs
    Page<ContactMessageResponse> getAllMessages(Locale locale, int page, int size);

    Page<ContactMessageResponse> getUnhandledMessages(Locale locale, int page, int size);

    Page<ContactMessageResponse> getHandledMessages(Locale locale, int page, int size);

    Page<ContactMessageResponse> searchMessages(String query, Locale locale, int page, int size);

    void markMessageAsHandled(Long messageId, Long handledByUserId);

    ContactMessageResponse getMessageById(Long id, Locale locale);
}