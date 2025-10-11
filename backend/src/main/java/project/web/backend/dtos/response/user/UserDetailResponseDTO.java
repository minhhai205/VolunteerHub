package project.web.backend.dtos.response.user;

import lombok.*;
import project.web.backend.dtos.response.RoleResponseDTO;
import project.web.backend.utils.enums.UserStatus;

import java.io.Serializable;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDetailResponseDTO implements Serializable {
    private Long id;
    private String email;
    private String fullName;
    private UserStatus status;
    private String phoneNumber;
    private RoleResponseDTO role;
}
