package project.web.backend.mappers;


import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import project.web.backend.dtos.response.comment.CommentResponseDTO;
import project.web.backend.entities.Comment;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userFullName", source = "user.fullName")
    @Mapping(target = "postId", source = "post.id")
    @Mapping(target = "createdAt", source = "createdAt")
    CommentResponseDTO toDTO(Comment comment);
}
