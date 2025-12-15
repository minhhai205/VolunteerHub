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
public class EventCreationResponseDTO implements Serializable {
    private Long id;
    private String name;
    private String description;
    private String location;
    private String imageUrl;
    private Date startDate;
    private Date endDate;
    private EventRequestStatus status;
}
