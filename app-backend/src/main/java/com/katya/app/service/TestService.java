package com.katya.app.service;

import com.katya.app.entity.TestAPI;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface TestService {
    List<TestAPI> getTestList();
}
