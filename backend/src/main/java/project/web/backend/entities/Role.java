package project.web.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "roles")
@Builder
public class Role extends AbstractEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotBlank(message = "Role name must not be blank")
    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @NotBlank(message = "Description must not be blank")
    @Column(name = "description")
    private String description;
}
