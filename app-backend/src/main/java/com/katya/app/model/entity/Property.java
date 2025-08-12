package com.katya.app.model.entity;

import com.katya.app.model.baseEntity.BaseEntity;
import com.katya.app.util.enums.Locale;
import com.katya.app.util.enums.PropertyStatus;
import com.katya.app.util.enums.PropertyType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Entity
@Table(name = "property")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@ToString(exclude = {"translations", "images", "amenities", "contactMessages"})
public class Property extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String slug;

    private String code;

    @Column(name = "property_type", nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PropertyType propertyType = PropertyType.APARTMENT;

    @Column(name = "price_month", nullable = false, precision = 12, scale = 2)
    private BigDecimal priceMonth;

    @Column(name = "area_sqm", precision = 10, scale = 2)
    private BigDecimal areaSqm;

    private Short bedrooms;

    private Short bathrooms;

    @Column(name = "floor_no")
    private Short floorNo;

    @Column(name = "pet_policy")
    private String petPolicy;

    @Column(name = "view_desc")
    private String viewDesc;

    private Double latitude;

    private Double longitude;

    @Column(name = "address_line")
    private String addressLine;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PropertyStatus status = PropertyStatus.PUBLISHED;

    @Column(name = "is_featured", nullable = false)
    @Builder.Default
    private Boolean isFeatured = false;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    // Audit fields
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private AppUser createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by")
    private AppUser updatedBy;

    // Relationships
    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @Builder.Default
    private List<PropertyI18n> translations = new ArrayList<>();

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @Builder.Default
    private List<PropertyImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @Builder.Default
    private List<PropertyAmenity> amenities = new ArrayList<>();

    @OneToMany(mappedBy = "property", fetch = FetchType.LAZY)
    @Builder.Default
    private List<ContactMessage> contactMessages = new ArrayList<>();

    // Helper methods
    public PropertyI18n getTranslation(Locale locale) {
        return translations.stream()
                .filter(t -> t.getLocale() == locale)
                .findFirst()
                .orElse(null);
    }

    public PropertyImage getCoverImage() {
        return images.stream()
                .filter(PropertyImage::getIsCover)
                .min(Comparator.comparing(PropertyImage::getSortOrder))
                .orElse(images.stream()
                        .min(Comparator.comparing(PropertyImage::getSortOrder))
                        .orElse(null));
    }

    // Property type specific helpers
    public boolean isRoom() {
        return PropertyType.ROOM.equals(this.propertyType);
    }

    public boolean isApartment() {
        return PropertyType.APARTMENT.equals(this.propertyType);
    }

    public boolean isStudio() {
        return PropertyType.STUDIO.equals(this.propertyType);
    }

    public boolean isHouse() {
        return PropertyType.HOUSE.equals(this.propertyType);
    }

    public String getDisplayName(Locale locale) {
        PropertyI18n translation = getTranslation(locale);
        if (translation != null && translation.getTitle() != null) {
            return translation.getTitle();
        }
        return getTranslation(Locale.VI) != null ?
                getTranslation(Locale.VI).getTitle() : "Property " + id;
    }
}