package project.web.backend.dtos.response.event;

import lombok.*;

import java.io.Serializable;


@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventNameResponseDTO implements Serializable {
    private Long id;
    private String name;
}
