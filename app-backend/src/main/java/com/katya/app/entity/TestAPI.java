package com.katya.app.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name="test_api")
public class TestAPI {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String content;
}
