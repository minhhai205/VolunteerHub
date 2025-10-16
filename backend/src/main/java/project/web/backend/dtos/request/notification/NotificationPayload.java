package project.web.backend.dtos.request.notification;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NotificationPayload {
    private String title;
    private String body;
    private String data; // JSON string cho data tùy chỉnh
}
