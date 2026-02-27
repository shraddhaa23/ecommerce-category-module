package com.shrads.models;

import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Category 
{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long categoryId;
	
	@NotBlank(message = "Category name is required")
	@Column(length = 100, nullable = false,unique = true)
	@Pattern(
	        regexp = "^(?!\\s*$)[A-Za-z ]+$",
	        message = "Category name can contain only letters and spaces"
	)
	private String categoryName;
	
	@NotBlank(message = "Description is required")
	@Column(length = 300, nullable = false)
	private String description;
	
	@CreatedDate
	private Instant createdAt;
	
	@LastModifiedDate
	private Instant updatedAt;
	
	@Column(nullable = false)
	private boolean status = true;
}
