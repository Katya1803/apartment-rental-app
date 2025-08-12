package com.katya.app.controller;

import com.katya.app.model.baseEntity.TestAPI;
import com.katya.app.service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/test")
public class TestController {
    private final TestService testService;

    @Autowired
    public TestController(TestService testService) {
        this.testService = testService;
    }

    @GetMapping
    public List<TestAPI> getAllTestList() {
        return this.testService.getTestList();
    }

    @PostMapping
    public void addData(@RequestBody TestAPI testAPI) {
        this.testService.createData(testAPI);
    }

    @DeleteMapping("/{id}")
    public void deleteData(@PathVariable Long id) {
        this.testService.deleteDataById(id);
    }
}
