package project.web.backend.dtos.request.post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.io.Serializable;
import java.util.Set;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePostRequestDTO implements Serializable {
    @NotNull
    private Long eventId;
    private String title;
    @NotBlank
    private String content;
    private Set<String> medias;
}
