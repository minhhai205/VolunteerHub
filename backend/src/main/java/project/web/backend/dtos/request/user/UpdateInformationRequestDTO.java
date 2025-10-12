package project.web.backend.dtos.request.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import project.web.backend.utils.annotations.PhoneNumber;
import project.web.backend.utils.enums.UserStatus;

import java.io.Serializable;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateInformationRequestDTO implements Serializable {
    @NotBlank(message = "full name must not be blank")
    private String fullName;
    @PhoneNumber(message = "phone number format was invalid")
    private String phoneNumber;
}
