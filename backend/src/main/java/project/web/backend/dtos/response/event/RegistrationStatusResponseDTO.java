package project.web.backend.dtos.response.event;

import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationStatusResponseDTO implements Serializable {
    private String status;
}
