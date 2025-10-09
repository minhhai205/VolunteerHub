package project.web.backend.dtos.response;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import project.web.backend.utils.enums.UserStatus;

import java.io.Serializable;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO implements Serializable {
    private Long id;
    private String email;
    private String fullName;
    private UserStatus status;
}
