package project.web.backend.dtos.request;

import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequestDTO implements Serializable {
    private String email;
    private String password;
    private String fullName;
}
