package project.web.backend.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import project.web.backend.dtos.response.statistic.AdminStatisticsResponseDTO;
import project.web.backend.dtos.response.statistic.EventStatisticDTO;
import project.web.backend.dtos.response.statistic.ManagerStatisticsResponseDTO;
import project.web.backend.repositories.EventMemberRepository;
import project.web.backend.repositories.EventRepository;
import project.web.backend.repositories.EventRequestRepository;
import project.web.backend.repositories.PostRepository;
import project.web.backend.utils.commons.AppConst;
import project.web.backend.utils.commons.SecurityUtil;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StatisticService {
    private final EventRepository eventRepository;
    private final EventMemberRepository eventMemberRepository;
    private final PostRepository postRepository;
    private final EventRequestRepository eventRequestRepository;
    private final ExecutorService executor = Executors.newFixedThreadPool(4);

    public ManagerStatisticsResponseDTO getManagerDashboardStatistics() throws ExecutionException, InterruptedException {
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


        return ManagerStatisticsResponseDTO.builder()
                .totalEvents(totalEventsFuture.get())
                .totalVolunteers(totalVolunteersFuture.get())
                .trendingEvents(Math.min(trendingEventsFuture.get(), 10))
                .totalNewDiscussionPosts(totalNewDiscussionPostsFuture.get())
                .build();
    }

    public AdminStatisticsResponseDTO getAdminDashboardStatistics() throws ExecutionException, InterruptedException {
        log.info("--------------- Get admin dashboard statistics ---------------");

        CompletableFuture<Long> totalEventsFuture = CompletableFuture.supplyAsync(
                eventRepository::countAll, executor
        );

        CompletableFuture<Long> totalVolunteersFuture = CompletableFuture.supplyAsync(
                eventMemberRepository::countAll, executor
        );

        // Đếm sô event có ít nhất n thành viên tham gia
        CompletableFuture<Long> trendingEventsFuture = CompletableFuture.supplyAsync(
                () -> eventRepository.countTopTrending(AppConst.numberOfMemberForTrendingEvent), executor
        );

        // Đếm số post 7 ngày gần nhất
        LocalDateTime daysAgo = LocalDateTime.now().minusDays(7);
        CompletableFuture<Long> totalNewDiscussionPostsFuture = CompletableFuture.supplyAsync(
                () -> postRepository.countRecentPosts(daysAgo), executor
        );

        CompletableFuture.allOf(
                totalEventsFuture,
                totalVolunteersFuture,
                trendingEventsFuture,
                totalNewDiscussionPostsFuture
        ).join();


        return AdminStatisticsResponseDTO.builder()
                .totalEvents(totalEventsFuture.get())
                .totalVolunteers(totalVolunteersFuture.get())
                .trendingEvents(Math.min(trendingEventsFuture.get(), 10))
                .totalNewDiscussionPosts(totalNewDiscussionPostsFuture.get())
                .build();
    }

    public EventStatisticDTO getEventRequestStatistics() {
        log.info("--------------- Get event request statistics ---------------");

        List<Object[]> result = eventRequestRepository.countStatistics();

        if (result.isEmpty()) {
            return new EventStatisticDTO(0L, 0L, 0L, 0L);
        }

        Object[] row = result.getFirst();

        return new EventStatisticDTO(
                row[0] == null ? 0L : ((Number) row[0]).longValue(),
                row[1] == null ? 0L : ((Number) row[1]).longValue(),
                row[2] == null ? 0L : ((Number) row[2]).longValue(),
                row[3] == null ? 0L : ((Number) row[3]).longValue()
        );
    }
}
