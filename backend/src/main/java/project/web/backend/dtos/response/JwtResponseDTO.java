package project.web.backend.dtos.response;


import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponseDTO implements Serializable {
    private String accessToken;
    private String refreshToken;
}
