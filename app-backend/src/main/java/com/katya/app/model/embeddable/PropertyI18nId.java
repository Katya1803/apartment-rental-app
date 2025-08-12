package com.katya.app.model.embeddable;

import com.katya.app.util.enums.Locale;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertyI18nId implements Serializable {

    @Column(name = "property_id")
    private Long propertyId;

    @Column(name = "locale")
    @Enumerated(EnumType.STRING)
    private Locale locale;
}