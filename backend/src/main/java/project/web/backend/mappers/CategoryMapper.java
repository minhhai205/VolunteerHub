package project.web.backend.mappers;

import org.mapstruct.Mapper;
import project.web.backend.dtos.response.category.CategoryResponseDTO;
import project.web.backend.entities.Category;

@Mapper(componentModel = "spring", uses = {})
public interface CategoryMapper {
    CategoryResponseDTO toResponseDTO(Category category);
}
