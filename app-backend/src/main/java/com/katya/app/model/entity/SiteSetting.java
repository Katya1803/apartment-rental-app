package com.katya.app.model.entity;

import com.katya.app.util.enums.Locale;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "site_setting")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"translations", "updatedBy"})
public class SiteSetting {

    @Id
    @Column(name = "key")
    private String key;

    @Column(name = "value", columnDefinition = "TEXT")
    private String value;

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by")
    private AppUser updatedBy;

    // Relationships
    @OneToMany(mappedBy = "siteSetting", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @Builder.Default
    private List<SiteSettingI18n> translations = new ArrayList<>();

    // Helper methods
    public SiteSettingI18n getTranslation(Locale locale) {
        return translations.stream()
                .filter(t -> t.getLocale() == locale)
                .findFirst()
                .orElse(null);
    }

    public String getDisplayValue(Locale locale) {
        SiteSettingI18n translation = getTranslation(locale);
        if (translation != null && translation.getValue() != null) {
            return translation.getValue();
        }
        return value; // Fallback to default value
    }
}
