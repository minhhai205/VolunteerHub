package project.web.backend.dtos.response.post;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import project.web.backend.dtos.response.user.UserResponseDTO;
import project.web.backend.entities.*;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;


@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponseDTO implements Serializable {
    private Long id;
    private Long eventId;
    private UserResponseDTO user;
    private String title;
    private String content;
    private Set<PostMediaResponseDTO> medias;
    private Long likesCount;
    private Long commentsCount;
    private Date createdAt;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Boolean isLiked;
}
