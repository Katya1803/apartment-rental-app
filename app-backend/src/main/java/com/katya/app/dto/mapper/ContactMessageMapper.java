package com.katya.app.dto.mapper;

import com.katya.app.dto.request.ContactMessageRequest;
import com.katya.app.dto.response.ContactMessageResponse;
import com.katya.app.dto.response.PropertySummaryResponse;
import com.katya.app.model.entity.ContactMessage;
import com.katya.app.util.enums.Locale;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class ContactMessageMapper {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PropertyMapper propertyMapper;

    public ContactMessage toEntity(ContactMessageRequest request) {
        return ContactMessage.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .subject(request.getSubject())
                .message(request.getMessage())
                .preferredLang(request.getPreferredLang())
                .build();
    }

    public ContactMessageResponse toResponse(ContactMessage message, Locale locale) {
        PropertySummaryResponse propertyResponse = null;
        if (message.getProperty() != null) {
            propertyResponse = propertyMapper.toSummaryResponse(message.getProperty(), locale);
        }

        String responseTimeFormatted = null;
        if (message.isHandled()) {
            Duration responseTime = message.getResponseTime();
            if (responseTime != null) {
                responseTimeFormatted = formatDuration(responseTime);
            }
        }

        return ContactMessageResponse.builder()
                .id(message.getId())
                .fullName(message.getFullName())
                .email(message.getEmail())
                .phone(message.getPhone())
                .subject(message.getSubject())
                .message(message.getMessage())
                .property(propertyResponse)
                .preferredLang(message.getPreferredLang())
                .createdAt(message.getCreatedAt())
                .isHandled(message.isHandled())
                .handledBy(userMapper.toSummaryResponse(message.getHandledBy()))
                .handledAt(message.getHandledAt())
                .responseTimeFormatted(responseTimeFormatted)
                .build();
    }

    private String formatDuration(Duration duration) {
        long hours = duration.toHours();
        long minutes = duration.toMinutesPart();

        if (hours > 24) {
            long days = hours / 24;
            return String.format("%d days, %d hours", days, hours % 24);
        } else if (hours > 0) {
            return String.format("%d hours, %d minutes", hours, minutes);
        } else {
            return String.format("%d minutes", minutes);
        }
    }
}
