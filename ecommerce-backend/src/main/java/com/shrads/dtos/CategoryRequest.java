package com.shrads.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequest 
{
	 @NotBlank(message = "Category name is required")
	 @Size( max = 100 , message = "Category name must not exceed 100 characters")
	 private String categoryName;

	 @NotBlank(message = "Description is required")
	 @Size(max = 300 , message = "Description must not exceed 300 characters")
	 private String description;
}
