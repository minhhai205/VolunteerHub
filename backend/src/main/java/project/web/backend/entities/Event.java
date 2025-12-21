package project.web.backend.entities;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "events")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
public class Event extends AbstractEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotBlank(message = "Event name must not be blank")
    @Column(name = "name", nullable = false)
    private String name;

    @NotBlank(message = "Description must not be blank")
    @Column(name = "description", nullable = false)
    private String description;

    @NotBlank(message = "Location must not be blank")
    @Column(name = "location", nullable = false)
    private String location;

    @Column(name = "image_url")
    private String imageUrl;

    @NotNull(message = "Start date must not be null")
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "start_date", nullable = false)
    private Date startDate;

    @NotNull(message = "End date must not be null")
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "end_date", nullable = false)
    private Date endDate;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "events_categories"
            , joinColumns = @JoinColumn(name = "event_id")
            , inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private User manager;

    @OneToMany(
            mappedBy = "event",
            cascade = CascadeType.REMOVE,
            orphanRemoval = true
    )
    private Set<EventMember> members;

    @OneToMany(
            mappedBy = "event",
            cascade = CascadeType.REMOVE,
            orphanRemoval = true
    )
    private Set<Post> posts;

    @OneToMany(
            mappedBy = "event",
            cascade = CascadeType.REMOVE,
            orphanRemoval = true
    )
    private Set<EventRegistration> eventRegistrations;

    @OneToMany(
            mappedBy = "event",
            cascade = CascadeType.REMOVE,
            orphanRemoval = true
    )
    private Set<AchievementRecord> records;
}
