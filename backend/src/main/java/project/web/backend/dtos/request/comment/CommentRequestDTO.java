package project.web.backend.dtos.request.comment;

import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import project.web.backend.entities.Post;
import project.web.backend.entities.User;

import java.io.Serializable;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentRequestDTO implements Serializable {
    @NotNull(message = "post id must not be null")
    private Long postId;
    @NotBlank(message = "Content must not be blank")
    private String content;
}
