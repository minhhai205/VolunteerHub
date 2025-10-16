package project.web.backend.dtos.request.event;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventRequestDTO implements Serializable {
    @NotBlank(message = "Event name must not be blank")
    private String name;

    @NotBlank(message = "Description must not be blank")
    private String description;

    @NotBlank(message = "Location must not be blank")
    private String location;

    private String imageUrl;

    @NotNull(message = "Start date must not be null")
    private Date startDate;

    @NotNull(message = "End date must not be null")
    private Date endDate;

    private List<String> categoryNames;
}
