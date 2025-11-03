package project.web.backend.dtos.response.user;

import lombok.*;

import java.io.Serializable;


@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WorkingInformationResponseDTO implements Serializable {
    private long workingDay;
    private long workingHour;
    private long numberOfProject;
    private long completedProject;
}
