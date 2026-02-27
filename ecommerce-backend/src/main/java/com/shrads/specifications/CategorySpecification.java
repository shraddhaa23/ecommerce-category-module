package com.shrads.specifications;

import org.springframework.data.jpa.domain.Specification;
import com.shrads.models.Category;

public class CategorySpecification {

    public static Specification<Category> hasStatus(Boolean status) {

        return (root, query, criteriaBuilder) -> {

            if (status == null) {
                return criteriaBuilder.conjunction(); 
                // no filtering → return all
            }

            return criteriaBuilder.equal(root.get("status"), status);
        };
    }
}
