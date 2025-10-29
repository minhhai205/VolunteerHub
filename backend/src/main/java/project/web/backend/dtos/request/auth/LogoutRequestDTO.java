package project.web.backend.dtos.request.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LogoutRequestDTO implements Serializable {
    @NotBlank(message = "This access token must not be blank")
    private String accessToken;
    @NotBlank(message = "This refresh token must not be blank")
    private String refreshToken;
}
