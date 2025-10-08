package project.web.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "post_medias")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostMedia extends AbstractEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;

    @Column(name = "file_url")
    @NotBlank(message = "file_url must not be blank")
    private String fileUrl;
}
