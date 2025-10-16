package project.web.backend.mappers;


import org.mapstruct.Mapper;
import project.web.backend.dtos.response.post.PostMediaResponseDTO;
import project.web.backend.entities.PostMedia;

@Mapper(componentModel = "spring")
public interface PostMediaMapper {
    PostMediaResponseDTO toDTO(PostMedia postMedia);
}
