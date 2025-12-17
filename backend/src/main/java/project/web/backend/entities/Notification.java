package project.web.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import project.web.backend.utils.annotations.EnumPattern;
import project.web.backend.utils.enums.NotificationType;

@Entity
@Table(name = "notifications")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Notification extends AbstractEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User sendTo;

    @NotBlank(message = "Content must not be blank")
    private String content;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Type is required")
    @Column(name = "type")
    @EnumPattern(name = "Notification status", regexp = "EVENT|POST|COMMENT")
    private NotificationType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id")
    private Comment comment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_request_id")
    private EventCreateRequest eventRequest;
}
