package project.web.backend.dtos.request.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;


@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class WorkRatingRequestDTO implements Serializable {
    @NotEmpty
    private List<PersonalRatingDTO> dtos;
}
