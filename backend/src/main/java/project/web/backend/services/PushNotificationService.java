package project.web.backend.services;

import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import org.apache.http.HttpResponse;
import org.apache.http.util.EntityUtils;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.web.backend.dtos.request.notification.NotificationPayload;
import project.web.backend.dtos.response.notification.NotificationResponseDTO;
import project.web.backend.entities.PushSubscription;
import project.web.backend.entities.User;
import project.web.backend.exceptions.AppException;
import project.web.backend.repositories.NotificationRepository;
import project.web.backend.repositories.PushSubscriptionRepository;
import project.web.backend.repositories.UserRepository;
import project.web.backend.utils.commons.SecurityUtil;
import project.web.backend.utils.enums.ErrorCode;

import java.security.Security;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class PushNotificationService {

    private final PushSubscriptionRepository subscriptionRepository;
    private final PushService pushService;
    private final Gson gson;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;


    public PushNotificationService(
            PushSubscriptionRepository subscriptionRepository,
            UserRepository userRepository,
            @Value("${vapid.public.key}") String publicKey,
            @Value("${vapid.private.key}") String privateKey,
            @Value("${vapid.subject}") String subject,
            NotificationRepository notificationRepository) throws Exception {

        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
        this.gson = new Gson();

        Security.addProvider(new BouncyCastleProvider());

        pushService = new PushService();
        pushService.setPublicKey(publicKey);
        pushService.setPrivateKey(privateKey);
        pushService.setSubject(subject);
        this.notificationRepository = notificationRepository;
    }

    /**
     * Registers a push subscription for a user.
     *
     * @param endpoint The unique push service endpoint.
     * @param p256dh   The public key for message encryption.
     * @param auth     The authentication secret for the subscription.
     */
    @Transactional
    public void subscribe(String endpoint, String p256dh, String auth) {
        User currentUser = userRepository.findByEmail(SecurityUtil.getCurrentEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        PushSubscription subscription = subscriptionRepository
                .findByEndpoint(endpoint)
                .orElse(new PushSubscription());

        subscription.setUser(currentUser);
        subscription.setEndpoint(endpoint);
        subscription.setP256dh(p256dh);
        subscription.setAuth(auth);
        subscription.setActive(true);

        subscriptionRepository.save(subscription);
    }

    /**
     * Delete subscription.
     *
     * @param endpoint The unique push service endpoint.
     */
    @Transactional
    public void unsubscribe(String endpoint) {
        subscriptionRepository.deleteByEndpoint(endpoint);
    }

    /**
     * Send notification to a user.
     *
     * @param userId  Id user.
     * @param payload Notification content.
     */
    public void sendNotificationToUser(Long userId, NotificationPayload payload) {
        List<PushSubscription> subscriptions =
                subscriptionRepository.findByUserIdAndActiveTrue(userId);

        subscriptions.forEach(subscription -> {
            sendNotification(subscription, payload);
        });
    }

    /**
     * Send notification to all users.
     *
     * @param payload Notification content.
     */
    public void sendNotificationToAll(NotificationPayload payload, List<Long> userIds) {

        List<PushSubscription> subscriptions = subscriptionRepository.findByUserIdInAndActiveTrue(userIds);

        subscriptions.forEach(subscription -> {
            sendNotification(subscription, payload);
        });
    }

    private void sendNotification(PushSubscription subscription, NotificationPayload payload) {
        CompletableFuture.runAsync(() -> {
            try {
                nl.martijndwars.webpush.Subscription sub =
                        new nl.martijndwars.webpush.Subscription(
                                subscription.getEndpoint(),
                                new nl.martijndwars.webpush.Subscription.Keys(
                                        subscription.getP256dh(),
                                        subscription.getAuth()
                                )
                        );

                String payloadJson = gson.toJson(payload);
                Notification notification = new Notification(sub, payloadJson);

                HttpResponse response = pushService.send(notification);
                System.out.println("--------- Push response: " + response.getStatusLine());
                System.out.println("--------- Response body: " + EntityUtils.toString(response.getEntity()));

            } catch (Exception e) {
                if (e.getMessage() != null && e.getMessage().contains("410")) {
                    subscription.setActive(false);
                    subscriptionRepository.save(subscription);
                    System.out.println("⚠--------- Subscription hết hạn: " + subscription.getEndpoint());
                }
                throw new AppException(ErrorCode.SUBSCRIPTION_EXPIRED);
            }
        });
    }

    public List<NotificationResponseDTO> myNotifications() {
        String email = SecurityUtil.getCurrentEmail();
        return notificationRepository.getMyNotifications(email, PageRequest.of(0, 5))
                .stream().map(n -> NotificationResponseDTO.builder()
                        .id(n.getId())
                        .content(n.getContent())
                        .build()).toList();
    }
}