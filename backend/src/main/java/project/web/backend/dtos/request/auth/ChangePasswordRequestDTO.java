package project.web.backend.dtos.request.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;


@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChangePasswordRequestDTO implements Serializable {
    @NotBlank
    private String accessToken;
    
    @NotBlank(message = "Password must not be blank")
    private String currentPassword;

    @NotBlank(message = "Password must not be blank")
    private String newPassword;
}
