package com.katya.app.service;

import com.katya.app.model.baseEntity.TestAPI;
import java.util.List;

public interface TestService {
    List<TestAPI> getTestList();
    void createData(TestAPI testAPI);
    void deleteDataById(Long id);
}
