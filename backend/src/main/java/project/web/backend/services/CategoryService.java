package project.web.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.web.backend.dtos.response.category.CategoryResponseDTO;
import project.web.backend.mappers.CategoryMapper;
import project.web.backend.repositories.CategoryRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public List<CategoryResponseDTO> getAll() {
        return categoryRepository.findAll().stream().map(categoryMapper::toResponseDTO).toList();
    }
}
