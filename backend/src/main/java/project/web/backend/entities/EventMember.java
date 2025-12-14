package project.web.backend.entities;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.aspectj.weaver.IUnwovenClassFile;
import project.web.backend.utils.annotations.EnumPattern;
import project.web.backend.utils.enums.WorkStatus;

@Entity
@Table(name = "event_members")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
public class EventMember extends AbstractEntity {
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

    @Column(name = "work_status")
    @EnumPattern(name = "event working status", regexp = "PENDING|COMPLETED|ABSENT")
    @Enumerated(EnumType.STRING)
    private WorkStatus status = WorkStatus.PENDING;
}
