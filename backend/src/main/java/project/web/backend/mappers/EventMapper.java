package project.web.backend.mappers;
import org.mapstruct.Mapper;
import project.web.backend.dtos.request.EventRequestDTO;
import project.web.backend.dtos.response.EventResponseDTO;
import project.web.backend.entities.Event;

@Mapper(componentModel = "spring")
public interface EventMapper {
    Event toEntity(EventRequestDTO dto);

    EventResponseDTO toResponseDTO(Event entity);
}
