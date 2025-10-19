package project.web.backend.dtos.response.post;


import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostMediaResponseDTO implements Serializable {
    private Long id;
    private String fileUrl;
}
