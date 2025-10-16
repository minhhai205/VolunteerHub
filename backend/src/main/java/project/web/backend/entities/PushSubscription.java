package project.web.backend.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "push_subscriptions")
@Data
public class PushSubscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, unique = true)
    private String endpoint;

    @Column(nullable = false)
    private String p256dh;

    @Column(nullable = false)
    private String auth;

    @Column(nullable = false)
    private boolean active = true;
}
