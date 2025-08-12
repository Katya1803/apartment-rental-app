package com.katya.app.model.entity;

import com.katya.app.model.embeddable.ContentPageI18nId;
import com.katya.app.util.enums.Locale;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "content_page_i18n")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "contentPage")
public class ContentPageI18n {

    @EmbeddedId
    private ContentPageI18nId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("pageId")
    @JoinColumn(name = "page_id")
    private ContentPage contentPage;

    @Column(nullable = false)
    private String title;

    @Column(name = "body_md", columnDefinition = "TEXT")
    private String bodyMd;

    // Convenience methods
    public Locale getLocale() {
        return id != null ? id.getLocale() : null;
    }

    public String getBodyPreview(int maxLength) {
        if (bodyMd == null) return "";
        String plainText = bodyMd.replaceAll("#+\\s*", "").replaceAll("\\*", "");
        if (plainText.length() <= maxLength) return plainText;
        return plainText.substring(0, maxLength) + "...";
    }
}
