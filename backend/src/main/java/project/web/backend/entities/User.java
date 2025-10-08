package project.web.backend.entities;


import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import project.web.backend.utils.enums.UserStatus;

import java.util.Set;

@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
public class User extends AbstractEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Email(message = "Email form invalid")
    @NotBlank(message = "Email field must not be blank")
    @Column(name = "email")
    private String email;

    @NotBlank(message = "Password must not be blank")
    @Column(name = "password")
    private String password;

    @NotBlank(message = "Full name must not be blank")
    @Column(name = "full_name")
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private UserStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="role_id")
    private Role role;

    @OneToMany(mappedBy = "user")
    private Set<EventMember>members;

    @OneToMany(mappedBy = "manager")
    private Set<EventCreateRequest>creationRequests;

    @OneToMany(mappedBy = "user")
    private Set<EventRegistration>registrationRequests;

    @OneToMany(mappedBy = "user")
    private Set<Post>posts;

    @OneToMany(mappedBy = "user")
    private Set<Comment>comments;

    @OneToMany(mappedBy = "sendTo")
    private Set<Notification>notifications;

    @OneToMany(mappedBy = "user")
    private Set<AchievementRecord>achievements;
}
