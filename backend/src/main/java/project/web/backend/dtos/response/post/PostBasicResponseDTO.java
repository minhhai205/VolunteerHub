package project.web.backend.dtos.response.post;


import lombok.*;


import java.io.Serializable;
import java.util.Date;
import java.util.Set;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostBasicResponseDTO implements Serializable {
    private Long id;
    private Long eventId;
    private Long userId;
    private String title;
    private String content;
    private Set<PostMediaResponseDTO> medias;
    private Date createdAt;
}
