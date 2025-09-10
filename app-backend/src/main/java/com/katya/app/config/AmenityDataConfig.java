package com.katya.app.config;

import com.katya.app.model.entity.Amenity;
import com.katya.app.model.entity.AmenityI18n;
import com.katya.app.model.embeddable.AmenityI18nId;
import com.katya.app.repository.AmenityRepository;
import com.katya.app.util.enums.Locale;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class AmenityDataConfig {

    private final AmenityRepository amenityRepository;

    @Bean
    @Transactional
    public CommandLineRunner initAmenityData() {
        return args -> {
            if (amenityRepository.count() > 0) {
                log.info("Amenities already exist, skipping initialization");
                return;
            }

            log.info("Starting amenity data initialization...");

            // Initialize Included Services (IS_*)
            insertIncludedServices();

            // Initialize Interior Facilities (IF_*)
            insertInteriorFacilities();

            log.info("Amenity data initialization completed successfully!");
        };
    }

    private void insertIncludedServices() {
        log.info("Inserting Included Services data...");

        // Define Included Services with multilingual translations
        Map<String, Map<Locale, String>> includedServices = new HashMap<>();

        // Utilities & Basic Services
        includedServices.put("IS_electricity", Map.of(
                Locale.VI, "Điện",
                Locale.EN, "Electricity",
                Locale.JA, "電気"
        ));

        includedServices.put("IS_water", Map.of(
                Locale.VI, "Nước",
                Locale.EN, "Water",
                Locale.JA, "水道"
        ));

        includedServices.put("IS_wifi", Map.of(
                Locale.VI, "Wi-Fi",
                Locale.EN, "Wi-Fi",
                Locale.JA, "Wi-Fi"
        ));

        includedServices.put("IS_cable_tv", Map.of(
                Locale.VI, "Truyền hình cáp",
                Locale.EN, "Cable TV",
                Locale.JA, "ケーブルテレビ"
        ));

        includedServices.put("IS_gas", Map.of(
                Locale.VI, "Gas",
                Locale.EN, "Gas",
                Locale.JA, "ガス"
        ));

        // Management & Maintenance Services
        includedServices.put("IS_building_management", Map.of(
                Locale.VI, "Quản lý tòa nhà",
                Locale.EN, "Building Management",
                Locale.JA, "ビル管理"
        ));

        includedServices.put("IS_security_service", Map.of(
                Locale.VI, "Dịch vụ bảo vệ",
                Locale.EN, "Security Service",
                Locale.JA, "セキュリティサービス"
        ));

        includedServices.put("IS_cleaning_service", Map.of(
                Locale.VI, "Dịch vụ dọn dẹp",
                Locale.EN, "Cleaning Service",
                Locale.JA, "清掃サービス"
        ));

        includedServices.put("IS_maintenance_service", Map.of(
                Locale.VI, "Dịch vụ bảo trì",
                Locale.EN, "Maintenance Service",
                Locale.JA, "メンテナンスサービス"
        ));

        includedServices.put("IS_garbage_collection", Map.of(
                Locale.VI, "Thu gom rác",
                Locale.EN, "Garbage Collection",
                Locale.JA, "ゴミ収集"
        ));

        // Additional Services
        includedServices.put("IS_laundry_service", Map.of(
                Locale.VI, "Dịch vụ giặt ủi",
                Locale.EN, "Laundry Service",
                Locale.JA, "ランドリーサービス"
        ));

        includedServices.put("IS_parking_included", Map.of(
                Locale.VI, "Chỗ đậu xe",
                Locale.EN, "Parking Included",
                Locale.JA, "駐車場込み"
        ));

        includedServices.put("IS_reception_service", Map.of(
                Locale.VI, "Lễ tân",
                Locale.EN, "Reception Service",
                Locale.JA, "レセプションサービス"
        ));

        includedServices.put("IS_mail_service", Map.of(
                Locale.VI, "Dịch vụ thư tín",
                Locale.EN, "Mail Service",
                Locale.JA, "郵便サービス"
        ));

        includedServices.put("IS_backup_power", Map.of(
                Locale.VI, "Máy phát điện dự phòng",
                Locale.EN, "Backup Power",
                Locale.JA, "非常用電源"
        ));

        // Insert the data
        insertAmenityGroup(includedServices, "Included Services");
    }

    private void insertInteriorFacilities() {
        log.info("Inserting Interior Facilities data...");

        // Define Interior Facilities with multilingual translations
        Map<String, Map<Locale, String>> interiorFacilities = new HashMap<>();

        // Kitchen & Dining
        interiorFacilities.put("IF_kitchen", Map.of(
                Locale.VI, "Bếp",
                Locale.EN, "Kitchen",
                Locale.JA, "キッチン"
        ));

        interiorFacilities.put("IF_refrigerator", Map.of(
                Locale.VI, "Tủ lạnh",
                Locale.EN, "Refrigerator",
                Locale.JA, "冷蔵庫"
        ));

        interiorFacilities.put("IF_microwave", Map.of(
                Locale.VI, "Lò vi sóng",
                Locale.EN, "Microwave",
                Locale.JA, "電子レンジ"
        ));

        interiorFacilities.put("IF_dining_table", Map.of(
                Locale.VI, "Bàn ăn",
                Locale.EN, "Dining Table",
                Locale.JA, "ダイニングテーブル"
        ));

        interiorFacilities.put("IF_cooking_utensils", Map.of(
                Locale.VI, "Dụng cụ nấu ăn",
                Locale.EN, "Cooking Utensils",
                Locale.JA, "調理器具"
        ));

        // Living Area
        interiorFacilities.put("IF_sofa", Map.of(
                Locale.VI, "Ghế sofa",
                Locale.EN, "Sofa",
                Locale.JA, "ソファ"
        ));

        interiorFacilities.put("IF_television", Map.of(
                Locale.VI, "Ti vi",
                Locale.EN, "Television",
                Locale.JA, "テレビ"
        ));

        interiorFacilities.put("IF_coffee_table", Map.of(
                Locale.VI, "Bàn cà phê",
                Locale.EN, "Coffee Table",
                Locale.JA, "コーヒーテーブル"
        ));

        interiorFacilities.put("IF_bookshelf", Map.of(
                Locale.VI, "Giá sách",
                Locale.EN, "Bookshelf",
                Locale.JA, "本棚"
        ));

        // Bedroom
        interiorFacilities.put("IF_bed", Map.of(
                Locale.VI, "Giường",
                Locale.EN, "Bed",
                Locale.JA, "ベッド"
        ));

        interiorFacilities.put("IF_wardrobe", Map.of(
                Locale.VI, "Tủ quần áo",
                Locale.EN, "Wardrobe",
                Locale.JA, "ワードローブ"
        ));

        interiorFacilities.put("IF_desk", Map.of(
                Locale.VI, "Bàn làm việc",
                Locale.EN, "Desk",
                Locale.JA, "デスク"
        ));

        interiorFacilities.put("IF_chair", Map.of(
                Locale.VI, "Ghế",
                Locale.EN, "Chair",
                Locale.JA, "椅子"
        ));

        // Bathroom
        interiorFacilities.put("IF_private_bathroom", Map.of(
                Locale.VI, "Phòng tắm riêng",
                Locale.EN, "Private Bathroom",
                Locale.JA, "専用バスルーム"
        ));

        interiorFacilities.put("IF_shower", Map.of(
                Locale.VI, "Vòi sen",
                Locale.EN, "Shower",
                Locale.JA, "シャワー"
        ));

        interiorFacilities.put("IF_bathtub", Map.of(
                Locale.VI, "Bồn tắm",
                Locale.EN, "Bathtub",
                Locale.JA, "浴槽"
        ));

        // Climate & Comfort
        interiorFacilities.put("IF_air_conditioning", Map.of(
                Locale.VI, "Điều hòa",
                Locale.EN, "Air Conditioning",
                Locale.JA, "エアコン"
        ));

        interiorFacilities.put("IF_balcony", Map.of(
                Locale.VI, "Ban công",
                Locale.EN, "Balcony",
                Locale.JA, "バルコニー"
        ));

        // Additional Interior Items
        interiorFacilities.put("IF_washing_machine", Map.of(
                Locale.VI, "Máy giặt",
                Locale.EN, "Washing Machine",
                Locale.JA, "洗濯機"
        ));

        interiorFacilities.put("IF_closet", Map.of(
                Locale.VI, "Tủ đựng đồ",
                Locale.EN, "Closet",
                Locale.JA, "クローゼット"
        ));

        interiorFacilities.put("IF_mirror", Map.of(
                Locale.VI, "Gương",
                Locale.EN, "Mirror",
                Locale.JA, "鏡"
        ));

        // Insert the data
        insertAmenityGroup(interiorFacilities, "Interior Facilities");
    }

    private void insertAmenityGroup(Map<String, Map<Locale, String>> amenitiesData, String groupName) {
        int insertedCount = 0;

        for (Map.Entry<String, Map<Locale, String>> entry : amenitiesData.entrySet()) {
            String key = entry.getKey();
            Map<Locale, String> translations = entry.getValue();

            try {
                // Check if amenity already exists
                if (amenityRepository.existsByKey(key)) {
                    log.debug("Amenity {} already exists, skipping", key);
                    continue;
                }

                // Create amenity
                Amenity amenity = Amenity.builder()
                        .key(key)
                        .build();

                amenity = amenityRepository.save(amenity);
                log.debug("Created amenity: {}", key);

                // Create translations
                for (Map.Entry<Locale, String> translationEntry : translations.entrySet()) {
                    Locale locale = translationEntry.getKey();
                    String label = translationEntry.getValue();

                    AmenityI18n amenityI18n = AmenityI18n.builder()
                            .id(new AmenityI18nId(amenity.getId(), locale))
                            .amenity(amenity)
                            .label(label)
                            .build();

                    amenity.getTranslations().add(amenityI18n);
                }

                amenityRepository.save(amenity);
                insertedCount++;
                log.debug("Added translations for amenity: {} ({})", key, translations.get(Locale.EN));

            } catch (Exception e) {
                log.error("Failed to insert amenity: {}", key, e);
            }
        }

        log.info("Successfully inserted {} {} amenities", insertedCount, groupName);
    }
}