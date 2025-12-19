package project.web.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import project.web.backend.dtos.response.ApiSuccessResponse;
import project.web.backend.dtos.response.category.CategoryResponseDTO;
import project.web.backend.services.CategoryService;

import java.util.List;

@RestController
@Validated
@RequiredArgsConstructor
@RequestMapping("/api/category")
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping("/all")
    public ApiSuccessResponse<List<CategoryResponseDTO>> getAllCategories() {
        return ApiSuccessResponse.<List<CategoryResponseDTO>>builder()
                .data(categoryService.getAll())
                .message("Get all successfully!")
                .status(HttpStatus.OK.value())
                .build();
    }
}
