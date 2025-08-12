package com.katya.app.model.entity;

import com.katya.app.model.baseEntity.BaseEntity;
import com.katya.app.util.enums.Locale;
import com.katya.app.util.enums.PropertyStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "content_page")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@ToString(exclude = {"translations", "createdBy", "updatedBy"})
public class ContentPage extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PropertyStatus status = PropertyStatus.PUBLISHED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private AppUser createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by")
    private AppUser updatedBy;

    // Relationships
    @OneToMany(mappedBy = "contentPage", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @Builder.Default
    private List<ContentPageI18n> translations = new ArrayList<>();

    // Helper methods
    public ContentPageI18n getTranslation(Locale locale) {
        return translations.stream()
                .filter(t -> t.getLocale() == locale)
                .findFirst()
                .orElse(null);
    }

    public String getDisplayTitle(Locale locale) {
        ContentPageI18n translation = getTranslation(locale);
        if (translation != null && translation.getTitle() != null) {
            return translation.getTitle();
        }
        // Fallback to Vietnamese
        ContentPageI18n viTranslation = getTranslation(Locale.VI);
        return viTranslation != null ? viTranslation.getTitle() : slug;
    }
}
