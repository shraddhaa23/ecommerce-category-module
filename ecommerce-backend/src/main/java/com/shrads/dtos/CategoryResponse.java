package com.shrads.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoryResponse {

    private Long categoryId;
    private String categoryName;
    private String description;
    private boolean status;
}