package project.web.backend.dtos.response.statistic;

import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventStatisticDTO implements Serializable {
    private Long totalEvents;
    private Long totalPending;
    private Long totalApproved;
    private Long totalRejected;
}
