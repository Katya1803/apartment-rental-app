package com.katya.app.repository;

import com.katya.app.model.baseEntity.TestAPI;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestRepository extends JpaRepository<TestAPI, Long> {
}
