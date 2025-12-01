package project.web.backend.dtos.response.auth;

import lombok.*;

import java.io.Serializable;


@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ForgotPasswordResponseDTO implements Serializable {
    private String resetToken;
}
