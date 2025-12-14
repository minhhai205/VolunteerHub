package project.web.backend.mappers;


import org.mapstruct.Mapper;
import project.web.backend.dtos.response.event.EventCreationResponseDTO;
import project.web.backend.entities.EventCreateRequest;

@Mapper(componentModel = "spring")
public interface EventCreationMapper {
    EventCreationResponseDTO toDTO(EventCreateRequest request);
}
