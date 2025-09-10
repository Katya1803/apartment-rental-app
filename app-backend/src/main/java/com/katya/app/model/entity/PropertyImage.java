package com.katya.app.model.entity;

import com.katya.app.model.baseEntity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "property_image")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@ToString(exclude = "property")
public class PropertyImage extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "mime_type")
    private String mimeType;

    @Column(name = "file_size")
    private Integer fileSize;

    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private Short sortOrder = 0;

    @Column(name = "is_cover", nullable = false)
    @Builder.Default
    private Boolean isCover = false;

    public String getImageUrl() {
        if (filePath == null) {
            return "/images/placeholder.jpg";
        }

        if (filePath.startsWith("http")) {
            return filePath;
        }

        return "http://localhost:8080/uploads/" + filePath;
    }

    public String getImageSizeFormatted() {
        if (fileSize == null) return "Unknown size";
        if (fileSize < 1024) return fileSize + " B";
        if (fileSize < 1024 * 1024) return String.format("%.1f KB", fileSize / 1024.0);
        return String.format("%.1f MB", fileSize / (1024.0 * 1024.0));
    }
}
