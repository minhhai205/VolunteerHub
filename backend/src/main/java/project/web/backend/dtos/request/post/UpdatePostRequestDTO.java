package project.web.backend.dtos.request.post;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;
import java.util.Set;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdatePostRequestDTO implements Serializable {
    @NotBlank
    private String title;
    @NotBlank
    private String content;
    private Set<String> medias;
}
