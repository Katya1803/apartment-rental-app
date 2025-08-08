package com.katya.app.service.impl;

import com.katya.app.entity.TestAPI;
import com.katya.app.repository.TestRepository;
import com.katya.app.service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestServiceImpl implements TestService {
    private final TestRepository testRepository;

    @Autowired
    public TestServiceImpl(TestRepository testRepository) {
        this.testRepository = testRepository;
    }

    @Override
    public List<TestAPI> getTestList() {
        return testRepository.findAll();
    }
}
