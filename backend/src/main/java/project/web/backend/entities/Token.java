package project.web.backend.entities;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;


@Entity
@Table(name = "tokens")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setter
@Getter
public class Token {
    @Id
    private String jti;

    @Column(name = "email")
    @NotBlank(message = "This field must not be blank")
    private String email;
}
