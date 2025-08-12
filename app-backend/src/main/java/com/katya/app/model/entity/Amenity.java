package com.katya.app.model.entity;

import com.katya.app.util.enums.Locale;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "amenity")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"translations", "properties"})
public class Amenity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Short id;

    @Column(nullable = false, unique = true)
    private String key;

    // Relationships
    @OneToMany(mappedBy = "amenity", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @Builder.Default
    private List<AmenityI18n> translations = new ArrayList<>();

    @OneToMany(mappedBy = "amenity", fetch = FetchType.LAZY)
    @Builder.Default
    private List<PropertyAmenity> properties = new ArrayList<>();

    // Helper methods
    public AmenityI18n getTranslation(Locale locale) {
        return translations.stream()
                .filter(t -> t.getLocale() == locale)
                .findFirst()
                .orElse(null);
    }

    public String getDisplayLabel(Locale locale) {
        AmenityI18n translation = getTranslation(locale);
        if (translation != null && translation.getLabel() != null) {
            return translation.getLabel();
        }
        // Fallback to Vietnamese
        AmenityI18n viTranslation = getTranslation(Locale.VI);
        return viTranslation != null ? viTranslation.getLabel() : key;
    }

    // Check if amenity is suitable for specific property types
    public boolean isRoomAmenity() {
        return key.startsWith("shared_") || key.startsWith("private_") ||
                key.equals("laundry_service") || key.equals("cleaning_service");
    }

    public boolean isCommonAmenity() {
        return !isRoomAmenity();
    }
}
