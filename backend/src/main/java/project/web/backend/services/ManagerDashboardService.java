package project.web.backend.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import project.web.backend.dtos.response.dashboard.ManagerDashboardResponseDTO;
import project.web.backend.repositories.EventMemberRepository;
import project.web.backend.repositories.EventRepository;
import project.web.backend.repositories.PostRepository;
import project.web.backend.utils.commons.AppConst;
import project.web.backend.utils.commons.SecurityUtil;

import java.time.LocalDateTime;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ManagerDashboardService {
    private final EventRepository eventRepository;
    private final EventMemberRepository eventMemberRepository;
    private final PostRepository postRepository;
    private final ExecutorService executor = Executors.newFixedThreadPool(4);

    public ManagerDashboardResponseDTO getManagerDashboardStatistics() throws ExecutionException, InterruptedException {
        log.info("----------------- Get manager dashboard statistics ------------------");
        String email = SecurityUtil.getCurrentEmail();

        CompletableFuture<Long> totalEventsFuture = CompletableFuture.supplyAsync(
                () -> eventRepository.countByManagerEmail(email), executor
        );

        CompletableFuture<Long> totalVolunteersFuture = CompletableFuture.supplyAsync(
                () -> eventMemberRepository.countByManagerEmail(email), executor
        );

        // Đếm sô event có ít nhất n thành viên tham gia
        CompletableFuture<Long> trendingEventsFuture = CompletableFuture.supplyAsync(
                () -> eventRepository.countTopTrendingEventsByManagerEmail(
                        email, AppConst.numberOfMemberForTrendingEvent), executor
        );

        // Đếm số post 7 ngày gần nhất
        LocalDateTime daysAgo = LocalDateTime.now().minusDays(7);
        CompletableFuture<Long> totalNewDiscussionPostsFuture = CompletableFuture.supplyAsync(
                () -> postRepository.countRecentPostsByManager(email, daysAgo), executor
        );

        CompletableFuture.allOf(
                totalEventsFuture,
                totalVolunteersFuture,
                trendingEventsFuture,
                totalNewDiscussionPostsFuture
        ).join();


        return ManagerDashboardResponseDTO.builder()
                .totalEvents(totalEventsFuture.get())
                .totalVolunteers(totalVolunteersFuture.get())
                .trendingEvents(trendingEventsFuture.get())
                .totalNewDiscussionPosts(totalNewDiscussionPostsFuture.get())
                .build();
    }
}
