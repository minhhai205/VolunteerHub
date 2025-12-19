package project.web.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import project.web.backend.dtos.request.notification.SubscriptionRequest;
import project.web.backend.dtos.response.ApiSuccessResponse;
import project.web.backend.dtos.response.notification.NotificationResponseDTO;
import project.web.backend.services.PushNotificationService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notifications")
public class PushNotificationController {

    private final PushNotificationService pushNotificationService;

    // Subscribe
    @PostMapping("/subscribe")
    public ApiSuccessResponse<String> subscribe(
            @RequestBody SubscriptionRequest request
    ) {

        pushNotificationService.subscribe(
                request.getEndpoint(),
                request.getKeys().getP256dh(),
                request.getKeys().getAuth()
        );

        return ApiSuccessResponse.<String>builder()
                .data("Subscribed successfully")
                .status(HttpStatus.OK.value())
                .message("Subscribed successfully")
                .build();
    }

    // Unsubscribe
    @DeleteMapping("/unsubscribe")
    public ApiSuccessResponse<String> unsubscribe(@RequestParam String endpoint) {
        pushNotificationService.unsubscribe(endpoint);

        return ApiSuccessResponse.<String>builder()
                .data("Unsubscribed successfully")
                .status(HttpStatus.OK.value())
                .message("Unsubscribed successfully")
                .build();
    }

    @GetMapping("/my-notifications")
    public ApiSuccessResponse<List<NotificationResponseDTO>> getNotifications() {
        return ApiSuccessResponse.<List<NotificationResponseDTO>>builder()
                .data(pushNotificationService.myNotifications())
                .status(HttpStatus.OK.value())
                .message("Get notifications")
                .build();
    }
}