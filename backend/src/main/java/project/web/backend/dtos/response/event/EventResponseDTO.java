package project.web.backend.dtos.response.event;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventResponseDTO implements Serializable {
    private Long id;

    private String name;

    private String description;

    private String location;

    private String imageUrl;

    private Date startDate;

    private Date endDate;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Set<String> categoryNames;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long countMembers;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long countPosts;
}
