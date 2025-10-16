package project.web.backend.dtos.request.auth;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequestDTO implements Serializable {
    @NotBlank(message = "email is must not be blank")
    @Email(message = "Email form was invalid")
    private String email;
    @NotBlank(message = "Password must not be blank")
    private String password;
}
