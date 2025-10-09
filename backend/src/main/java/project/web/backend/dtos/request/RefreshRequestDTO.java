package project.web.backend.dtos.request;


import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshRequestDTO implements Serializable {
    @NotBlank(message = "Refresh token must be required")
    private String refreshToken;
}
