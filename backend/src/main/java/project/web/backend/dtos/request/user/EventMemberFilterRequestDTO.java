package project.web.backend.dtos.request.user;

import lombok.*;
import project.web.backend.utils.enums.WorkStatus;

import java.io.Serializable;


@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventMemberFilterRequestDTO implements Serializable {
    private String search;
    private Long eventId;
    private WorkStatus status;
}
