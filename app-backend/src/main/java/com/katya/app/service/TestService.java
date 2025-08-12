package com.katya.app.service;

import com.katya.app.model.baseEntity.TestAPI;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface TestService {
    List<TestAPI> getTestList();
    void createData(TestAPI testAPI);
    void deleteDataById(Long id);
}
