package com.psygenie.service;

import com.psygenie.model.entities.Category;
import com.psygenie.model.entities.enums.CategoryNameEnum;

import java.util.List;

public interface CategoryService {
    Category findByName(CategoryNameEnum category);

    List<Category> initCategories();
}
