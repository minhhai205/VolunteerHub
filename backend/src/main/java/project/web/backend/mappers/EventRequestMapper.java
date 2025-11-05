package project.web.backend.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import project.web.backend.dtos.request.event.EventRequestDTO;
import project.web.backend.dtos.response.event.EventRegistrationResponseDTO;
import project.web.backend.dtos.response.event.EventRequestResponseDTO;
import project.web.backend.entities.Category;
import project.web.backend.entities.EventCreateRequest;
import project.web.backend.entities.EventRegistration;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface EventRequestMapper {
    EventCreateRequest toEntity(EventRequestDTO dto);

    @Mapping(target = "categoryNames", source = "categories", qualifiedByName = "mapCategoryNames")
    EventRequestResponseDTO toResponseDTO(EventCreateRequest event);

    @Mapping(target = "userName", source = "user.fullName")
    @Mapping(target = "userEmail", source = "user.email")
    @Mapping(target = "eventId", source = "event.id")
    @Mapping(target = "eventName", source = "event.name")
    @Mapping(target = "registeredDate", source = "createdAt")
    EventRegistrationResponseDTO toEventRegistrationResponseDTO(EventRegistration eventRegistration);

    @Named("mapCategoryNames")
    default Set<String> mapCategoryNames(Set<Category> categories) {
        if (categories == null) return Collections.emptySet();
        return categories.stream()
                .map(Category::getName)
                .collect(Collectors.toSet());
    }
}
