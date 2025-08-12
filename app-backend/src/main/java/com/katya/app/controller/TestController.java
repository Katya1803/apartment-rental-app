package com.katya.app.controller;

import com.katya.app.dto.common.ApiResponse;
import com.katya.app.model.baseEntity.TestAPI;
import com.katya.app.service.TestService;
import com.katya.app.util.ResponseBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {

    private final TestService testService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TestAPI>>> getAllTestList() {
        List<TestAPI> testList = testService.getTestList();
        return ResponseBuilder.success(testList);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TestAPI>> addData(@Valid @RequestBody TestAPI testAPI) {
        testService.createData(testAPI);
        return ResponseBuilder.created(testAPI, "Test data created successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteData(
            @PathVariable @NotNull Long id) {
        testService.deleteDataById(id);
        return ResponseBuilder.success("Test data deleted successfully");
    }
}