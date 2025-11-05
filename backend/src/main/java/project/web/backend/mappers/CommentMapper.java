package project.web.backend.mappers;


import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import project.web.backend.dtos.response.comment.CommentResponseDTO;
import project.web.backend.entities.Comment;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface CommentMapper {
    CommentResponseDTO toDTO(Comment comment);
}
