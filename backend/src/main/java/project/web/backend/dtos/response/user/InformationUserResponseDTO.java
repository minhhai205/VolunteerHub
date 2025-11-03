package project.web.backend.dtos.response.user;

import lombok.*;
import project.web.backend.dtos.response.RoleResponseDTO;
import project.web.backend.utils.enums.UserStatus;

import java.io.Serializable;
import java.util.Date;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InformationUserResponseDTO implements Serializable {
    private Long id;
    private String email;
    private String fullName;
    private UserStatus status;
    private String phoneNumber;
    private RoleResponseDTO role;
    private Date createdAt;
}
