package project.web.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import project.web.backend.utils.annotations.EnumPattern;
import project.web.backend.utils.enums.EventRequestStatus;

@Entity
@Table(name = "events_registrations")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
public class EventRegistration extends AbstractEntity {
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

    @EnumPattern(name = "event request status", regexp = "PENDING|APPROVED|REJECTED")
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private EventRequestStatus status;
}
