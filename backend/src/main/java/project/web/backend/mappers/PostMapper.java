package project.web.backend.mappers;


import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import project.web.backend.dtos.response.post.PostBasicResponseDTO;
import project.web.backend.dtos.response.post.PostResponseDTO;
import project.web.backend.entities.Post;

@Mapper(componentModel = "spring", uses = {PostMediaMapper.class, UserMapper.class})
public interface PostMapper {
    @Mapping(source = "event.id", target = "eventId")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "createdAt", target = "createdAt")
    PostBasicResponseDTO toBasicDTO(Post post);

    @Mapping(source = "event.id", target = "eventId")
//    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "createdAt", target = "createdAt")
    PostResponseDTO toDTO(Post post);
}
