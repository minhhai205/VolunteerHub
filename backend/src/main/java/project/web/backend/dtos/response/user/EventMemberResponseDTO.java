package project.web.backend.dtos.response.user;

import lombok.*;
import project.web.backend.utils.enums.WorkStatus;

import java.io.Serializable;
import java.util.Date;


@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventMemberResponseDTO implements Serializable {
    private Long id;
    private String memberName;
    private String email;
    private String eventName;
    private Date registrationDate;
    private Long workingHour;
    private WorkStatus status;
}
