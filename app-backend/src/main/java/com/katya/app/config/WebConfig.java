// src/main/java/com/katya/app/config/WebConfig.java
package com.katya.app.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.path:uploads/}")
    private String uploadPath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Map /uploads/** URLs to file system uploads/ directory
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadPath);
    }
}