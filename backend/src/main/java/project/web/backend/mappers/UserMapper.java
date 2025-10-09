package project.web.backend.mappers;


import org.mapstruct.Mapper;
import project.web.backend.dtos.response.UserResponseDTO;
import project.web.backend.entities.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    public UserResponseDTO toDTO(User user);
}
