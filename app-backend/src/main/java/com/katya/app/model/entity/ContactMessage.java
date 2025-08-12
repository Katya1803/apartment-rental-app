package com.katya.app.model.entity;

import com.katya.app.util.enums.Locale;
import jakarta.persistence.*;
import lombok.*;

import java.time.Duration;
import java.time.LocalDateTime;

@Entity
@Table(name = "contact_message")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"property", "handledBy"})
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    private String email;

    private String phone;

    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id")
    private Property property;

    @Column(name = "preferred_lang")
    @Enumerated(EnumType.STRING)
    private Locale preferredLang;

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "handled_by")
    private AppUser handledBy;

    @Column(name = "handled_at")
    private LocalDateTime handledAt;

    // Helper methods
    public boolean isHandled() {
        return handledAt != null;
    }

    public String getPropertyDisplayName() {
        if (property != null) {
            Locale locale = preferredLang != null ? preferredLang : Locale.VI;
            return property.getDisplayName(locale);
        }
        return "General Inquiry";
    }

    public String getPropertyTypeDisplay() {
        if (property != null) {
            return property.getPropertyType().getCode();
        }
        return null;
    }

    public Duration getResponseTime() {
        if (createdAt != null && handledAt != null) {
            return Duration.between(createdAt, handledAt);
        }
        return null;
    }
}
