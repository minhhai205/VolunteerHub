package project.web.backend.dtos.response.comment;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import project.web.backend.entities.Post;
import project.web.backend.entities.User;

import java.io.Serializable;
import java.util.Date;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponseDTO implements Serializable {
    private Long id;
    private Long postId;
    private Long userId;
    private String userFullName;
    private String content;
    private Date createdAt;
}
