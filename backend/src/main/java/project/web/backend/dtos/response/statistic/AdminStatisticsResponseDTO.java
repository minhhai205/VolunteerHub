package project.web.backend.dtos.response.statistic;


import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatisticsResponseDTO implements Serializable {
    private Long totalEvents;
    private Long totalVolunteers;
    private Long trendingEvents;
    private Long totalNewDiscussionPosts;
}
