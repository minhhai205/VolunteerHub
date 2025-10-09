package project.web.backend.dtos.request;

import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventCreationRequestDTO implements Serializable {
    private String email;
    private String password;
    private String fullName;
}
