package com.shrads.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shrads.dtos.CategoryRequest;
import com.shrads.dtos.CategoryResponse;
import com.shrads.models.Category;
import com.shrads.repositories.CategoryRepository;
import com.shrads.responsewrapper.MyResponseWrapper;
import com.shrads.specifications.CategorySpecification;

@Service
public class CategoryService 
{
	@Autowired
	CategoryRepository categoryRepository;
	
	private ResponseEntity<?> universalResponse(String message, Object data, HttpStatus httpStatus) {

		MyResponseWrapper responseWrapper = new MyResponseWrapper();
	    responseWrapper.setMessage(message);
	    responseWrapper.setData(data);

	    return new ResponseEntity<>(responseWrapper, httpStatus);
	}
	
	public ResponseEntity<?> addCategory(CategoryRequest request) {

	    if (categoryRepository.existsByCategoryName(request.getCategoryName())) {
	        return universalResponse("Category already exists",null,HttpStatus.CONFLICT);
	    }

	    Category category = new Category();
	    category.setCategoryName(request.getCategoryName());
	    category.setDescription(request.getDescription());
	    category.setStatus(true);

	    Category savedCategory = categoryRepository.save(category);

	    CategoryResponse response = new CategoryResponse(
	            savedCategory.getCategoryId(),
	            savedCategory.getCategoryName(),
	            savedCategory.getDescription(),
	            savedCategory.isStatus()
	    );

	    return universalResponse("Category added successfully",response,HttpStatus.CREATED);
	}
	
	@Transactional
	public ResponseEntity<Void> toggleCategoryStatus(Long id) {

	    Category category = categoryRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Category not found"));

	    category.setStatus(!category.isStatus()); // toggle

	    return ResponseEntity.noContent().build(); // 204
	}
	
	@Transactional
	public ResponseEntity<?> updateCategory(Long id, CategoryRequest request) {

	    Category category = categoryRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Category not found"));

	    // Business rule: cannot update inactive category
	    if (!category.isStatus()) {
	        return universalResponse(
	                "Inactive category cannot be updated",
	                null,
	                HttpStatus.BAD_REQUEST
	        );
	    }

	    // Check duplicate name if changed
	    if (!category.getCategoryName().equals(request.getCategoryName()) &&
	            categoryRepository.existsByCategoryName(request.getCategoryName())) {

	        return universalResponse(
	                "Category name already exists",
	                null,
	                HttpStatus.CONFLICT
	        );
	    }

	    category.setCategoryName(request.getCategoryName());
	    category.setDescription(request.getDescription());

	    CategoryResponse response = new CategoryResponse(
	            category.getCategoryId(),
	            category.getCategoryName(),
	            category.getDescription(),
	            category.isStatus()
	    );

	    return universalResponse(
	            "Category updated successfully",
	            response,
	            HttpStatus.OK
	    );
	}
	
	@Transactional(readOnly = true)
	public ResponseEntity<?> getCategories(Boolean status, int page, int size) {

	    Pageable pageable = PageRequest.of(page, size);

	    Specification<Category> spec =
	            CategorySpecification.hasStatus(status);

	    Page<Category> categoryPage =
	            categoryRepository.findAll(spec, pageable);

	    Page<CategoryResponse> responsePage =
	            categoryPage.map(category -> new CategoryResponse(
	                    category.getCategoryId(),
	                    category.getCategoryName(),
	                    category.getDescription(),
	                    category.isStatus()
	            ));

	    return universalResponse(
	            "Categories fetched successfully",
	            responsePage,
	            HttpStatus.OK
	    );
	}
	
	@Transactional(readOnly = true)
	public ResponseEntity<?> getCategoryById(Long id) {

	    Optional<Category> optionalCategory = categoryRepository.findById(id);

	    if (optionalCategory.isEmpty()) {
	        return universalResponse(
	                "Category not found",
	                null,
	                HttpStatus.NOT_FOUND
	        );
	    }

	    Category category = optionalCategory.get();

	    CategoryResponse response = new CategoryResponse(
	            category.getCategoryId(),
	            category.getCategoryName(),
	            category.getDescription(),
	            category.isStatus()
	    );

	    return universalResponse(
	            "Category fetched successfully",
	            response,
	            HttpStatus.OK
	    );
	}
}
