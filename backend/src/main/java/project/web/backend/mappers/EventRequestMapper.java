package project.web.backend.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import project.web.backend.dtos.request.event.EventRequestDTO;
import project.web.backend.dtos.response.event.EventRequestResponseDTO;
import project.web.backend.entities.Category;
import project.web.backend.entities.EventCreateRequest;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface EventRequestMapper {
    EventCreateRequest toEntity(EventRequestDTO dto);

    @Mapping(target = "categoryNames", source = "categories", qualifiedByName = "mapCategoryNames")
    EventRequestResponseDTO toResponseDTO(EventCreateRequest event);

    @Named("mapCategoryNames")
    default Set<String> mapCategoryNames(Set<Category> categories) {
        if (categories == null) return Collections.emptySet();
        return categories.stream()
                .map(Category::getName)
                .collect(Collectors.toSet());
    }
}
