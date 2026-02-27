package com.shrads.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.shrads.models.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>,JpaSpecificationExecutor<Category>
{
	boolean existsByCategoryName(String categoryName);
}
