package com.katya.app.model.entity;

import com.katya.app.model.embeddable.PropertyAmenityId;
import com.katya.app.util.enums.Locale;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "property_amenity")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"property", "amenity"})
public class PropertyAmenity {

    @EmbeddedId
    private PropertyAmenityId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("propertyId")
    @JoinColumn(name = "property_id")
    private Property property;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("amenityId")
    @JoinColumn(name = "amenity_id")
    private Amenity amenity;

    // Helper methods
    public String getAmenityLabel(Locale locale) {
        return amenity != null ? amenity.getDisplayLabel(locale) : null;
    }
}
