package com.katya.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@EnableJpaAuditing
@EnableScheduling
@EnableConfigurationProperties
@EnableMethodSecurity
@SpringBootApplication
public class ApartmentRentalApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApartmentRentalApplication.class, args);
	}

}
