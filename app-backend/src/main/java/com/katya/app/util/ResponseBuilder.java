package com.katya.app.util;

import com.katya.app.dto.common.ApiResponse;
import com.katya.app.dto.common.PageResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

public class ResponseBuilder {

    // Success responses
    public static <T> ResponseEntity<ApiResponse<T>> success(T data) {
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    public static <T> ResponseEntity<ApiResponse<T>> success(T data, String message) {
        return ResponseEntity.ok(ApiResponse.success(data, message));
    }

    public static ResponseEntity<ApiResponse<String>> success(String message) {
        return ResponseEntity.ok(ApiResponse.success(message));
    }

    public static <T> ResponseEntity<ApiResponse<T>> created(T data) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(data, "Resource created successfully"));
    }

    public static <T> ResponseEntity<ApiResponse<T>> created(T data, String message) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(data, message));
    }

    // Paginated responses
    public static <T> ResponseEntity<ApiResponse<PageResponse<T>>> page(Page<T> page) {
        PageResponse<T> pageResponse = PageResponse.of(
                page.getContent(),
                page.getTotalElements(),
                page.getNumber(),
                page.getSize()
        );
        return ResponseEntity.ok(ApiResponse.success(pageResponse));
    }

    public static <T> ResponseEntity<ApiResponse<PageResponse<T>>> page(List<T> items, Long total, Integer currentPage, Integer pageSize) {
        PageResponse<T> pageResponse = PageResponse.of(items, total, currentPage, pageSize);
        return ResponseEntity.ok(ApiResponse.success(pageResponse));
    }

    // Error responses
    public static ResponseEntity<ApiResponse<Object>> error(HttpStatus status, String message) {
        return ResponseEntity.status(status)
                .body(ApiResponse.error(message));
    }

    public static ResponseEntity<ApiResponse<Object>> error(HttpStatus status, String message, Object errors) {
        return ResponseEntity.status(status)
                .body(ApiResponse.error(message, errors));
    }

    public static ResponseEntity<ApiResponse<Object>> badRequest(String message) {
        return error(HttpStatus.BAD_REQUEST, message);
    }

    public static ResponseEntity<ApiResponse<Object>> notFound(String message) {
        return error(HttpStatus.NOT_FOUND, message);
    }

    public static ResponseEntity<ApiResponse<Object>> conflict(String message) {
        return error(HttpStatus.CONFLICT, message);
    }

    public static ResponseEntity<ApiResponse<Object>> unauthorized(String message) {
        return error(HttpStatus.UNAUTHORIZED, message);
    }

    public static ResponseEntity<ApiResponse<Object>> forbidden(String message) {
        return error(HttpStatus.FORBIDDEN, message);
    }

    public static ResponseEntity<ApiResponse<Object>> internalServerError(String message) {
        return error(HttpStatus.INTERNAL_SERVER_ERROR, message);
    }
}
