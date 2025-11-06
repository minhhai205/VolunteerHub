package project.web.backend.dtos.response.event;

import lombok.*;
import project.web.backend.utils.enums.EventRequestStatus;

import java.io.Serializable;
import java.util.Date;


@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventRegistrationResponseDTO implements Serializable {
    private Long id;
    private String userName;
    private String userEmail;
    private Long eventId;
    private String eventName;
    private Date registeredDate;
    private EventRequestStatus status;
}
