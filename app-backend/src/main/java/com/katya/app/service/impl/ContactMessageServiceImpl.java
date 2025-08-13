package com.katya.app.service.impl;

import com.katya.app.dto.mapper.ContactMessageMapper;
import com.katya.app.dto.request.ContactMessageRequest;
import com.katya.app.dto.response.ContactMessageResponse;
import com.katya.app.exception.ResourceNotFoundException;
import com.katya.app.model.entity.AppUser;
import com.katya.app.model.entity.ContactMessage;
import com.katya.app.model.entity.Property;
import com.katya.app.repository.AppUserRepository;
import com.katya.app.repository.ContactMessageRepository;
import com.katya.app.repository.PropertyRepository;
import com.katya.app.service.ContactMessageService;
import com.katya.app.util.DtoUtils;
import com.katya.app.util.enums.Locale;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContactMessageServiceImpl implements ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;
    private final PropertyRepository propertyRepository;
    private final AppUserRepository userRepository;
    private final ContactMessageMapper contactMessageMapper;

    @Override
    @Transactional
    public void submitContactMessage(ContactMessageRequest request) {
        log.info("Submitting contact message from: {}", request.getEmail());

        ContactMessage message = contactMessageMapper.toEntity(request);

        // Link to property if provided
        if (request.getPropertyId() != null) {
            Property property = propertyRepository.findById(request.getPropertyId())
                    .orElse(null); // Don't fail if property not found
            message.setProperty(property);
        }

        contactMessageRepository.save(message);
        log.info("Contact message submitted successfully");

        // TODO: Send email notification to admin (implement in EmailService)
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ContactMessageResponse> getAllMessages(Locale locale, int page, int size) {
        locale = DtoUtils.parseLocale(locale.getCode(), Locale.VI);
        Pageable pageable = DtoUtils.createPageable(page, size, "createdAt", "desc");

        Page<ContactMessage> messages = contactMessageRepository.findAllOrderByCreatedAtDesc(pageable);
        Locale finalLocale = locale;
        return messages.map(message -> contactMessageMapper.toResponse(message, finalLocale));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ContactMessageResponse> getUnhandledMessages(Locale locale, int page, int size) {
        locale = DtoUtils.parseLocale(locale.getCode(), Locale.VI);
        Pageable pageable = DtoUtils.createPageable(page, size, "createdAt", "desc");

        Page<ContactMessage> messages = contactMessageRepository.findUnhandledMessages(pageable);
        Locale finalLocale = locale;
        return messages.map(message -> contactMessageMapper.toResponse(message, finalLocale));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ContactMessageResponse> getHandledMessages(Locale locale, int page, int size) {
        locale = DtoUtils.parseLocale(locale.getCode(), Locale.VI);
        Pageable pageable = DtoUtils.createPageable(page, size, "handledAt", "desc");

        Page<ContactMessage> messages = contactMessageRepository.findHandledMessages(pageable);
        Locale finalLocale = locale;
        return messages.map(message -> contactMessageMapper.toResponse(message, finalLocale));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ContactMessageResponse> searchMessages(String query, Locale locale, int page, int size) {
        locale = DtoUtils.parseLocale(locale.getCode(), Locale.VI);
        Pageable pageable = DtoUtils.createPageable(page, size, "createdAt", "desc");

        Page<ContactMessage> messages = contactMessageRepository.searchMessages(query, pageable);
        Locale finalLocale = locale;
        return messages.map(message -> contactMessageMapper.toResponse(message, finalLocale));
    }

    @Override
    @Transactional
    public void markMessageAsHandled(Long messageId, Long handledByUserId) {
        log.info("Marking message {} as handled by user {}", messageId, handledByUserId);

        ContactMessage message = contactMessageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("ContactMessage", "id", messageId));

        AppUser handledBy = userRepository.findById(handledByUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", handledByUserId));

        message.setHandledBy(handledBy);
        message.setHandledAt(LocalDateTime.now());

        contactMessageRepository.save(message);
        log.info("Message marked as handled successfully");
    }

    @Override
    @Transactional(readOnly = true)
    public ContactMessageResponse getMessageById(Long id, Locale locale) {
        locale = DtoUtils.parseLocale(locale.getCode(), Locale.VI);

        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ContactMessage", "id", id));

        return contactMessageMapper.toResponse(message, locale);
    }
}