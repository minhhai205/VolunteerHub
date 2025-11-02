package project.web.backend.dtos.response.post;

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
}
