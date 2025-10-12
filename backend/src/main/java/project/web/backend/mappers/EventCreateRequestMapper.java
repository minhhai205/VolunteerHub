package project.web.backend.mappers;


import org.mapstruct.Mapper;
import project.web.backend.dtos.request.event.EventRequestDTO;
import project.web.backend.entities.EventCreateRequest;

@Mapper(componentModel = "spring")
public interface EventCreateRequestMapper {
    EventCreateRequest toEntity(EventRequestDTO dto);
}
