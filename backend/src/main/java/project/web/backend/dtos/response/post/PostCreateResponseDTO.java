package project.web.backend.dtos.response.post;


import lombok.*;
import project.web.backend.entities.Event;
import project.web.backend.entities.User;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostCreateResponseDTO implements Serializable {
    private Long id;
    private Long eventId;
    private Long userId;
    private String title;
    private String content;
    private Set<PostMediaResponseDTO> medias;
    private Date createdAt;
}
