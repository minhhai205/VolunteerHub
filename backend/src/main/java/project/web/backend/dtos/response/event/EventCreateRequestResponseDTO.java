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
public class EventCreateRequestResponseDTO implements Serializable {
    private Long id;

    private String name;

    private String description;

    private String location;

    private String imageUrl;

    private Date startDate;

    private Date endDate;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Set<String> categoryNames;
}
