package project.web.backend.entities;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "likes")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class Like extends AbstractEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
