package com.shrads.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shrads.dtos.CategoryRequest;
import com.shrads.services.CategoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController 
{
	@Autowired
	CategoryService categoryService;
	
	@PostMapping
	public ResponseEntity<?> addCategory(@Valid @RequestBody CategoryRequest request){
		return categoryService.addCategory(request);
	}
	
	@PatchMapping("/{id}/status")
	public ResponseEntity<Void> toggleCategoryStatus(@PathVariable Long id) {
	    return categoryService.toggleCategoryStatus(id);
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<?> updateCategory(@PathVariable Long id,@Valid @RequestBody CategoryRequest request)
	{
		return categoryService.updateCategory(id, request);
	}
	
	@GetMapping
	public ResponseEntity<?> getCategories(
	        @RequestParam(required = false) Boolean status,
	        @RequestParam(defaultValue = "0") int page,
	        @RequestParam(defaultValue = "10") int size) 
	{

	    return categoryService.getCategories(status, page, size);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<?> getCategoryById(@PathVariable Long id) 
	{
	    return categoryService.getCategoryById(id);
	}
}
