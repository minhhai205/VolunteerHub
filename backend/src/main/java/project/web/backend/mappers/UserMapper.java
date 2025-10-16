package project.web.backend.mappers;


import org.mapstruct.Mapper;
import project.web.backend.dtos.response.user.UserDetailResponseDTO;
import project.web.backend.dtos.response.user.UserResponseDTO;
import project.web.backend.entities.User;

@Mapper(componentModel = "spring", uses = {RoleMapper.class})
public interface UserMapper {
    public UserResponseDTO toDTO(User user);

    public UserDetailResponseDTO toDetailDTO(User user);
}
