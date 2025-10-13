package project.web.backend.dtos.response;


import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoleResponseDTO implements Serializable {
    private Long id;
    private String name;
    private String description;
}
