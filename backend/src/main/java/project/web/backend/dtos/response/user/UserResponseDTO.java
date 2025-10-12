package project.web.backend.dtos.response.user;

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
    private String phoneNumber;
    private UserStatus status;
}
