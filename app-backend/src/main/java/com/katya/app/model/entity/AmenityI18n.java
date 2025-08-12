package com.katya.app.model.entity;

import com.katya.app.model.embeddable.AmenityI18nId;
import com.katya.app.util.enums.Locale;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "amenity_i18n")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "amenity")
public class AmenityI18n {

    @EmbeddedId
    private AmenityI18nId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("amenityId")
    @JoinColumn(name = "amenity_id")
    private Amenity amenity;

    @Column(nullable = false)
    private String label;

    // Convenience method
    public Locale getLocale() {
        return id != null ? id.getLocale() : null;
    }
}