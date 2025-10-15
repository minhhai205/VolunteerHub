package project.web.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import project.web.backend.utils.annotations.EnumPattern;
import project.web.backend.utils.enums.EventRequestStatus;

import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "event_create_requests")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class
EventCreateRequest extends AbstractEntity {
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
    @JoinTable(name = "events_create_categories"
            , joinColumns = @JoinColumn(name = "event_id")
            , inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private User manager;

    @EnumPattern(name = "event request status", regexp = "PENDING|APPROVED|REJECTED")
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private EventRequestStatus status;
}
