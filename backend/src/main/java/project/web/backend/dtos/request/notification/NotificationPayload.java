package project.web.backend.dtos.request.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPayload {
    private String title;
    private String body;
    private String url; // URL để redirect khi click
    private Object data; // Data tùy chỉnh
}