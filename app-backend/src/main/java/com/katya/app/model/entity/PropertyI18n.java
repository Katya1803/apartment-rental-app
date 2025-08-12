package com.katya.app.model.entity;

import com.katya.app.model.embeddable.PropertyI18nId;
import com.katya.app.util.enums.Locale;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "property_i18n")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "property")
public class PropertyI18n {

    @EmbeddedId
    private PropertyI18nId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("propertyId")
    @JoinColumn(name = "property_id")
    private Property property;

    @Column(nullable = false)
    private String title;

    @Column(name = "description_md", columnDefinition = "TEXT")
    private String descriptionMd;

    @Column(name = "address_text")
    private String addressText;

    // Convenience methods
    public Locale getLocale() {
        return id != null ? id.getLocale() : null;
    }

    public void setLocale(Locale locale) {
        if (this.id == null) {
            this.id = new PropertyI18nId();
        }
        this.id.setLocale(locale);
    }

    // Helper method for property type specific content
    public String getTypeSpecificDescription() {
        if (property != null && property.isRoom()) {
            return descriptionMd != null ? descriptionMd :
                    "Private room with " + (property.getBathrooms() > 0 ? "private" : "shared") + " facilities";
        }
        return descriptionMd;
    }
}