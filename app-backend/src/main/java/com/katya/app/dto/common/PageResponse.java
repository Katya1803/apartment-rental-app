package com.katya.app.dto.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageResponse<T> {
    private List<T> items;
    private Long totalElements;
    private Integer totalPages;
    private Integer currentPage;
    private Integer pageSize;
    private Boolean hasNext;
    private Boolean hasPrevious;

    public static <T> PageResponse<T> of(List<T> items, Long totalElements, Integer currentPage, Integer pageSize) {
        Integer totalPages = (int) Math.ceil((double) totalElements / pageSize);

        return PageResponse.<T>builder()
                .items(items)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .currentPage(currentPage)
                .pageSize(pageSize)
                .hasNext(currentPage < totalPages - 1)
                .hasPrevious(currentPage > 0)
                .build();
    }
}