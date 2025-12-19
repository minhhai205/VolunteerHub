package project.web.backend.dtos.response.notification;

import lombok.*;

import java.io.Serializable;


@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponseDTO implements Serializable {
    private Long id;
    private String content;
}
