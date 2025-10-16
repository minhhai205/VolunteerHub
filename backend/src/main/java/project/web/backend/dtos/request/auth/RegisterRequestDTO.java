package project.web.backend.dtos.request.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import project.web.backend.utils.annotations.PhoneNumber;

import java.io.Serializable;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequestDTO implements Serializable {
    @NotBlank(message = "Email must not be blank")
    private String email;
    @NotBlank(message = "Password must not be blank")
    private String password;
    @NotBlank(message = "Full name must not be blank")
    private String fullName;
    @PhoneNumber(message = "Invalid phone number format")
    private String phoneNumber;
}
