package project.web.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "achievement_records")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
public class AchievementRecord extends AbstractEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Temporal(TemporalType.DATE)
    @Column(name = "joined_at")
    @NotNull(message = "Joined day must not be null")
    private Date joinedAt;

    @Column(name = "hours_worked")
    @NotNull(message = "Working time must not be null")
    private Double hoursWorked;

    @NotBlank(message = "Content must not be blank")
    @Column(name = "content")
    private String content;
}
