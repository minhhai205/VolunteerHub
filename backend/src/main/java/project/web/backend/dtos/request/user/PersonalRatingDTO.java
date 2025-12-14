package project.web.backend.dtos.request.user;


import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PersonalRatingDTO implements Serializable {
    @NotNull
    private Long Id;
    @NotNull
    private Boolean isCompleted;
}
