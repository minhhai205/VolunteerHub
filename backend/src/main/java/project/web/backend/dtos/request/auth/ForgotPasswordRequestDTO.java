package project.web.backend.dtos.request.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;


@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ForgotPasswordRequestDTO implements Serializable {
    @NotBlank
    private String email;
}
