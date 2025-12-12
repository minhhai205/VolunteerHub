package project.web.backend.dtos.request.user;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import project.web.backend.utils.annotations.PhoneNumber;

import java.io.Serializable;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserCreationRequestDTO implements Serializable {
    @NotBlank(message = "Email must not be blank")
    private String email;
    @NotBlank(message = "Password must not be blank")
    private String password;
    @NotBlank(message = "Full name must not be blank")
    private String fullName;
    @NotBlank(message = "Role name must not be blank")
    private String roleName;
    @PhoneNumber(message = "Invalid phone number format")
    private String phoneNumber;
}
