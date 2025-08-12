package com.katya.app.model.entity;

import com.katya.app.model.embeddable.SiteSettingI18nId;
import com.katya.app.util.enums.Locale;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "site_setting_i18n")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "siteSetting")
public class SiteSettingI18n {

    @EmbeddedId
    private SiteSettingI18nId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("settingKey")
    @JoinColumn(name = "setting_key")
    private SiteSetting siteSetting;

    @Column(name = "value", columnDefinition = "TEXT")
    private String value;

    // Convenience method
    public Locale getLocale() {
        return id != null ? id.getLocale() : null;
    }
}
