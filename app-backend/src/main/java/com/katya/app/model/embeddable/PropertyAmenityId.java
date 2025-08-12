package com.katya.app.model.embeddable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertyAmenityId implements Serializable {

    @Column(name = "property_id")
    private Long propertyId;

    @Column(name = "amenity_id")
    private Short amenityId;
}