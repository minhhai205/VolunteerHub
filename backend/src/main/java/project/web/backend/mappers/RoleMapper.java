package project.web.backend.mappers;

import org.mapstruct.Mapper;
import project.web.backend.dtos.response.RoleResponseDTO;
import project.web.backend.entities.Role;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    public RoleResponseDTO toDTO(Role role);
}
