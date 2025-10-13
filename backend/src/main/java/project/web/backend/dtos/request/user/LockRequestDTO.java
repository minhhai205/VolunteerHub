package project.web.backend.dtos.request.user;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LockRequestDTO implements Serializable {
    @NotNull(message = "Lock must be required")
    private Boolean lock;
}
