package project.web.backend.entities;


import jakarta.persistence.*;
import lombok.*;
import org.aspectj.weaver.IUnwovenClassFile;

@Entity
@Table(name = "event_members")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
public class EventMember extends AbstractEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
